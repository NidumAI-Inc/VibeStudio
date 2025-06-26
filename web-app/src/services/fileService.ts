
import { BASE_URL } from './config';

export class FileService {
  async listFiles(path = '/') {
    const response = await fetch(`${BASE_URL}/list?path=${encodeURIComponent(path)}`);
    return response.json();
  }

  async readFile(path: string) {
    const response = await fetch(`${BASE_URL}/cat?path=${encodeURIComponent(path)}`);
    return response.text();
  }

  async writeFile(path: string, content: string) {
    const response = await fetch(`${BASE_URL}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content }),
    });
    return response.json();
  }

  async uploadFile(file: File, destination: string) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${BASE_URL}/upload?destination=${encodeURIComponent(destination)}`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }
}

export const fileService = new FileService();
