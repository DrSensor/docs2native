import * as core from '@actions/core'
import {exec} from '@actions/exec'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'

export async function install(): Promise<number> {
  //TODO: cache build & dependencies
  const sudo = os.platform() === 'win32' ? '' : 'sudo '
  const requirements = [
    exec(`${sudo}npm install --unsafe-perm --global tauri`),
    exec('cargo install tauri-bundler')
  ]
  if (os.platform() === 'linux')
    requirements.push(exec('sudo apt install --yes webkit2gtk-4.0'))

  await Promise.all(requirements)
  return exec('tauri', ['info'])
}

export async function build(
  cwd: string,
  conf: {build: {[key: string]: any}; tauri: {[key: string]: any}} // TODO: use https://github.com/tauri-apps/tauri/blob/dev/cli/tauri.js/src/types/config.ts
): Promise<string> {
  core.info('===Prepare===')
  await exec('npm', ['init', '--yes'], {cwd})
  await exec('tauri', ['init'], {cwd})
  fs.writeFileSync(
    path.join(cwd, 'src-tauri/tauri.conf.json'),
    JSON.stringify(conf, null, 2)
  )
  core.debug(`tauri.conf.json\n${JSON.stringify(conf, null, 2)}`)

  core.info('===Build===')
  await exec('tauri', ['build'], {cwd})
  switch (os.platform()) {
    case 'win32':
      return path.resolve(cwd, 'src-tauri/target/release/app.exe')
    default:
      await exec('chmod +x', ['src-tauri/target/release/app'], {cwd})
      return path.resolve(cwd, 'src-tauri/target/release/app')
  }
}
