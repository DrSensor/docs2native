import * as core from '@actions/core'
import {exec} from '@actions/exec'
import * as path from 'path'
import * as os from 'os'

export async function install(): Promise<number> {
  const platform = os.platform()
  switch (platform) {
    case 'linux':
      return exec('sudo snap install hugo --channel=extended')
    case 'darwin':
      return exec('brew install hugo')
    case 'win32':
      return exec('choco install hugo-extended -confirm')
    default:
      throw new Error(`os '${platform}' not supported`)
  }
}

export async function build(cwd: string): Promise<string> {
  core.debug(`hugo build ${cwd}`)
  await exec('hugo', [], {cwd})
  return path.resolve(cwd, 'public')
}
