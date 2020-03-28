import * as core from '@actions/core'
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
