import * as core from '@actions/core'
import {exec} from '@actions/exec'
import * as path from 'path'
import * as os from 'os'

export async function install(): Promise<void> {
  const platform = os.platform()
  switch (platform) {
    case 'linux':
      await exec('sudo snap install hugo --channel=extended')
      break
    case 'darwin':
      await exec('brew install hugo')
      break
    case 'win32':
      await exec('choco install hugo-extended -confirm')
      break
    default:
      throw new Error(`os '${platform}' not supported`)
  }
}

export async function build(cwd: string): Promise<string> {
  core.debug(`hugo build ${cwd}`)
  await exec('hugo', [], {cwd})
  return path.resolve(cwd, 'public')
}
