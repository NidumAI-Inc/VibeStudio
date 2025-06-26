import { exec, spawn } from 'child_process';
import util from 'util';

export const execPromise = util.promisify(exec)

export function runCommandInBg(command: string, args: string[] = []) {
  return new Promise((resolve, reject) => {
    spawn(command, args, {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    })

    resolve("")
  })
}
