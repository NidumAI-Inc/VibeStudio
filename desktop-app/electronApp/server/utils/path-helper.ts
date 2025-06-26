import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import os from 'os';

import packageJson from '../../../package.json';

const homeDirectory = os.homedir()

const mainPath = ".nativenode"

export function getRoot() {
  return path.join(homeDirectory, mainPath)
}

export function createPath(newPath: string[] = []) {
  return path.join(getRoot(), ...newPath)
}

export function getTunnelConfigPath() {
  return createPath([`tunnel-config-${packageJson?.version?.replaceAll(".", "_")}.json`])
}

function tunnelConfigPathCheck() {
  const configPath = getTunnelConfigPath()

  if (!existsSync(configPath)) {
    writeFileSync(configPath, JSON.stringify({}))
  }
}

export function checkIsDirExists(directoryPath = "") {
  if (!existsSync(directoryPath)) {
    try {
      mkdirSync(directoryPath, { recursive: true });
      console.log(`Directory created: ${directoryPath}`);
      return false

    } catch (err) {
      console.error(`Error creating directory: ${err.message}`);
      return false
    }

  } else {
    console.log(`Directory already exists: ${directoryPath}`);
    return true
  }
}

export function checkPathsSetup() {
  const directoryPath = getRoot()
  checkIsDirExists(directoryPath)
  tunnelConfigPathCheck()
}