const _ = require(`lodash`)
const chalk = require(`chalk`)
const remark = require(`remark`)

/*
  Note:

  https://github.com/facebook/jest/blob/master/packages/jest-diff/src/index.ts
  does not re-export NO_DIFF_MESSAGE from
  https://github.com/facebook/jest/blob/master/packages/jest-diff/src/constants.ts
*/
export const NO_DIFF_MESSAGE = chalk.dim(
  "Compared values have no visual difference."
)

expect.extend({
  toReport(reporter, name, expected) {
    let pass = true
    let message = ``

    if (!expected) {
      const numberOfTimes = reporter.mock.calls.length
      if (numberOfTimes !== 0) {
        pass = false

        const numberOfTimes = reporter.mock.calls.length
        const calledWith = _.map(
          reporter.mock.calls,
          (args, index) => `${index}: ${JSON.stringify(args)}`
        ).join(`\n`)

        message = `Reporter '${name}' should not have been called.

It was called ${numberOfTimes} times.

${calledWith}
`
      }
    } else {
      const messages = []
      const numberOfTimes = reporter.mock.calls.length
      if (numberOfTimes !== expected.length) {
        messages.push(
          `should have been called ${expected.length} times and not ${numberOfTimes}.\n`
        )
      }

      expected.forEach((expectedMessage, index) => {
        let args = [expectedMessage]
        if (typeof expectedMessage === `object`) {
          args = expectedMessage
        }
        const nthCall = index + 1
        const diff = this.utils.diff(reporter.mock.calls[index], args)

        if (diff !== NO_DIFF_MESSAGE) {
          messages.push(`[${index}]:\n${diff}\n`)
        }
      })

      if (!_.isEmpty(messages)) {
        pass = false
        message = `Reporter '${name}' did not match expected values:

${messages.join(`\n`)}
`
      }
    }

    return {
      pass,
      message: () => message,
    }
  },
})

const testPlugin = ({
  code,
  reporter: { info, warn, error, panic, panicOnBuild } = {},
  options = {},
} = {}) => {
  jest.mock(`gatsby-cli/lib/reporter`, () => {
    return {
      panicOnBuild: jest.fn(),
      panic: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
    }
  })
  // must load plugin here so that jest reloads it with each run of the test
  // otherwise index.spec/fails the build when can't find Java and Graphviz
  // won't work correctly
  const plugin = require(`../index`)
  const reporter = require(`gatsby-cli/lib/reporter`)

  const markdownAST = remark.parse(code)
  return plugin({ markdownAST, reporter }, options).then(() => {
    // Hack the AST to remove the untestable variable bit of the generated svg
    // Its the comment block at the bottom that includes the PlantUML runtime information.
    if (markdownAST.children && markdownAST.children.length) {
      const svg = markdownAST.children[0].value
      markdownAST.children[0].value = svg.replace(
        /PlantUML [\s\S]*Country: [\S]*/m,
        ``
      )
    }

    expect(reporter.info).toReport(`info`, info)
    expect(reporter.warn).toReport(`warn`, warn)
    expect(reporter.error).toReport(`error`, error)
    expect(reporter.panic).toReport(`panic`, panic)
    expect(reporter.panicOnBuild).toReport(`panicOnBuild`, panicOnBuild)
    expect(markdownAST).toMatchSnapshot({})

    return markdownAST
  })
}

module.exports = {
  testPlugin,
}
