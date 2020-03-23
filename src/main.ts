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

    const result = async () => {
      switch (generator) {
        case 'hugo':
          await hugo.install()
          return hugo.build(docs)
        default:
          throw new Error(`\`generator: ${generator}}\` not supported`)
      }
    }

    core.setOutput('path', await result())
    core.setOutput('name', generator)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
