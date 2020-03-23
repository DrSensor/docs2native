import * as core from '@actions/core'
import {exec} from '@actions/exec'
import * as path from 'path'
import * as os from 'os'

export async function install() {
  const platform = os.platform()
  switch (platform) {
    case 'linux':
      await exec('sudo snap install hugo')
      break
    case 'darwin':
      await exec('brew install hugo')
      break
    case 'win32':
      await exec('choco install hugo -confirm')
      break
    default:
      throw new Error(`os '${platform}' not supported`)
  }
  exec('hugo', ['--version'], {listeners: {stdline: core.info}})
}

export async function build(workdir: string): Promise<string> {
  await exec('hugo', [], {
    cwd: workdir,
    listeners: {
      stdout: data => core.info(data.toString()),
      stderr: data => core.error(data.toString())
    }
  })
  return path.resolve(workdir, '/public')
}
