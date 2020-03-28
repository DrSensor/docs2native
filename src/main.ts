import {readFileSync, writeFileSync} from 'fs'
import {join} from 'path'
import * as core from '@actions/core'
import {exec} from '@actions/exec'
import * as hugo from './hugo'
import * as tauri from './tauri'
import tauriConf from './tauri.conf.json'

async function run(): Promise<void> {
  try {
    const generator = core.getInput('generator', {required: true})
    const docs = core.getInput('docs', {required: true})

    core.debug(`path: ${docs}`)
    // TODO: support `generator: auto`
    /* if (await docs.isHugoPath) generator = 'hugo' */
    core.debug(`static site generator: ${generator}`)

    switch (generator) {
      case 'hugo':
        await Promise.all([hugo.install(), tauri.install()])

        core.debug(`===modify ${generator} config===`)
        const hugoConfig = join(docs, 'config.toml')
        const hugoConf = readFileSync(hugoConfig, 'utf-8')
        writeFileSync(
          hugoConfig,
          hugoConf.replace(
            /baseURL\s+=\s+".*"/,
            `baseURL = "${tauriConf.build.devPath}"`
          )
        )
        await exec('hugo', ['config'], {cwd: docs})

        tauriConf.build.distDir = await hugo.build(docs)
        tauriConf.tauri.window.title =
          hugoConf.match(/title = "(.*)"/)?.[1] ?? 'Hugo'
        break
      default:
        throw new Error(`\`generator: ${generator}}\` not supported`)
    }

    const result = await tauri.build(docs, tauriConf)
    core.debug(`executable:\n\t${result}]`)

    core.setOutput('path', result)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
