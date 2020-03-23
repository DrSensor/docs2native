import * as core from '@actions/core'
import * as hugo from './hugo'

async function run(): Promise<void> {
  try {
    const generator = core.getInput('generator', {required: true})
    const docs = core.getInput('docs', {required: true})

    core.debug(`path: ${docs}`)
    // TODO: support `generator: auto`
    /* if (await docs.isHugoPath) generator = 'hugo' */
    core.debug(`static site generator: ${generator}`)

    let result: string
    switch (generator) {
      case 'hugo':
        await hugo.install()
        result = await hugo.build(docs)
        break
      default:
        throw new Error(`\`generator: ${generator}}\` not supported`)
    }
    core.debug(`generated ${result}]`)

    core.setOutput('name', generator)
    core.setOutput('path', result)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
