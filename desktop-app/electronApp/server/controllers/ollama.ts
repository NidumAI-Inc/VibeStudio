import express, { Request, Response } from 'express';
import { createWriteStream } from 'fs';
import { extract } from 'tar';
import AdmZip from 'adm-zip';
import https from 'https';
import http from 'http';
import path from 'path';
import fs from 'fs';
import os from 'os';

import { createPath } from '../utils/path-helper';

const router = express.Router();

interface DownloadProgress {
  type: 'download' | 'extract';
  progress: number;
  message: string;
  total?: number;
  downloaded?: number;
}

function getSystemFileName(): string {
  const platform = os.platform();
  const arch = os.arch();

  switch (platform) {
    case 'darwin':
      return 'ollama-darwin.tgz';
    case 'linux':
      if (arch === 'arm64') {
        return 'ollama-linux-arm64.tgz';
      } else if (arch === 'x64') {
        return 'ollama-linux-amd64.tgz';
      }
      return 'ollama-linux-amd64.tgz';
    case 'win32':
      if (arch === 'x64') {
        return 'ollama-windows-amd64.zip';
      }
      return 'ollama-windows-amd64.zip';
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

async function downloadFile(
  url: string,
  destination: string,
  onProgress: (progress: DownloadProgress) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, destination, onProgress)
            .then(resolve)
            .catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      const totalSize = parseInt(response.headers['content-length'] || '0', 10);
      let downloadedSize = 0;

      const fileStream = createWriteStream(destination);

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const progress = totalSize > 0 ? (downloadedSize / totalSize) * 100 : 0;

        onProgress({
          type: 'download',
          progress: Math.round(progress),
          message: `Downloading... ${Math.round(downloadedSize / 1024 / 1024)}MB${totalSize > 0 ? ` / ${Math.round(totalSize / 1024 / 1024)}MB` : ''}`,
          total: totalSize,
          downloaded: downloadedSize
        });
      });

      response.on('error', reject);
      fileStream.on('error', reject);
      fileStream.on('close', resolve);

      response.pipe(fileStream);
    }).on('error', reject);
  });
}

async function extractFile(
  filePath: string,
  extractPath: string,
  onProgress: (progress: DownloadProgress) => void
): Promise<void> {
  const isZip = filePath.endsWith('.zip');
  const isTgz = filePath.endsWith('.tgz') || filePath.endsWith('.tar.gz');

  onProgress({
    type: 'extract',
    progress: 0,
    message: 'Starting extraction...'
  });

  if (isZip) {
    const zip = new AdmZip(filePath);
    const entries = zip.getEntries();
    const totalEntries = entries.length;

    return new Promise((resolve, reject) => {
      try {
        let extractedEntries = 0;

        zip.extractAllToAsync(extractPath, true, false, (error) => {
          if (error) {
            reject(error);
          } else {
            onProgress({
              type: 'extract',
              progress: 100,
              message: 'Extraction completed!'
            });
            resolve();
          }
        });

        const progressInterval = setInterval(() => {
          extractedEntries += Math.ceil(totalEntries / 20);
          if (extractedEntries >= totalEntries) {
            extractedEntries = totalEntries;
            clearInterval(progressInterval);
          }

          const progress = Math.round((extractedEntries / totalEntries) * 100);
          onProgress({
            type: 'extract',
            progress: Math.min(progress, 95),
            message: `Extracting... ${extractedEntries}/${totalEntries} files`
          });
        }, 100);

      } catch (error) {
        reject(error);
      }
    });

  } else if (isTgz) {
    return new Promise((resolve, reject) => {
      let extractedFiles = 0;
      let totalFiles = 0;
      extract({
        file: filePath,
        cwd: extractPath,
        onentry: () => totalFiles++
      }).then(() => {
        extract({
          file: filePath,
          cwd: extractPath,
          onentry: () => {
            extractedFiles++;
            const progress = totalFiles > 0 ? Math.round((extractedFiles / totalFiles) * 100) : 0;
            onProgress({
              type: 'extract',
              progress,
              message: `Extracting... ${extractedFiles}/${totalFiles} files`
            });
          }
        }).then(() => {
          onProgress({
            type: 'extract',
            progress: 100,
            message: 'Extraction completed!'
          });
          resolve();
        }).catch(reject);
      }).catch(reject);
    });
  } else {
    throw new Error('Unsupported file format');
  }
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const version = 'v0.9.0'
    const downloadPath = createPath(['ollama'])

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    const sendProgress = (data: DownloadProgress) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const fileName = getSystemFileName();
      console.log({ fileName })
      const downloadUrl = `https://github.com/ollama/ollama/releases/download/${version}/${fileName}`;
      console.log({ downloadUrl })

      const fullDownloadPath = path.resolve(downloadPath);
      if (!fs.existsSync(fullDownloadPath)) {
        fs.mkdirSync(fullDownloadPath, { recursive: true });
      }
      const filePath = path.join(fullDownloadPath, fileName);
      const extractPath = path.join(fullDownloadPath);

      sendProgress({
        type: 'download',
        progress: 0,
        message: `Starting download of ${fileName}...`
      });

      await downloadFile(downloadUrl, filePath, sendProgress);

      await extractFile(filePath, extractPath, sendProgress);
      sendProgress({
        type: 'extract',
        progress: 100,
        message: 'Process completed successfully!'
      });

      fs.unlinkSync(filePath)

      res.write('data: {"type": "complete", "message": "Process finished"}\n\n');
      res.end();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      sendProgress({
        type: 'download',
        progress: 0,
        message: `Error: ${errorMessage}`
      });
      res.end();
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;