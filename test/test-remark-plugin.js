const remark = require(`remark`)

expect.extend({
  toMatchPlantUmlError(actual, expected) {
    let pass = true
    let messageString

    if (actual.message !== expected.message) {
      pass = false
      messageString = `'message's dont match actual='${actual.message}' !== expected='${expected.message}'`
    } else if (actual.lineNumber !== expected.lineNumber) {
      pass = false
      messageString = `'lineNumber's dont match actual=${actual.lineNumber} !== expected=${expected.lineNumber}`
    } else if (actual.generalError !== expected.generalError) {
      pass = false
      messageString = `'generalError's dont match actual='${actual.generalError}' !== expected='${expected.generalError}'`
    }

    if (!pass) {
      // WORKAROUND: for FIXME below in toReport() on failed matchers
      /* eslint-disable no-console */
      console.log(`toMatchPlantUmlError`)
      console.log(`actual`, actual)
      console.log(`expected`, expected)
      console.log(`reason = ${messageString}`)
      /* eslint-enable no-console */
    }

    return {
      pass: pass,
      // FIXME: message isn't invoked properly by toReport's toHaveBeenNthCalledWith()
      message: () => messageString,
    }
  },
  toReport(reporter, expected) {
    if (!expected) {
      expect(reporter).not.toHaveBeenCalled()
    } else {
      expect(reporter).toHaveBeenCalledTimes(expected.length)
      expected.forEach((message, index) => {
        let args = [message]
        if (typeof message === `object`) {
          args = message
        }
        const nthCall = index + 1
        // FIXME: This invokes our matchers but doesn't use their `message`
        // What you end up with is an unhelpful error message
        expect(reporter).toHaveBeenNthCalledWith(nthCall, ...args)
      })
    }

    return {
      pass: true,
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

    expect(reporter.info).toReport(info)
    expect(reporter.warn).toReport(warn)
    expect(reporter.error).toReport(error)
    expect(reporter.panic).toReport(panic)
    expect(reporter.panicOnBuild).toReport(panicOnBuild)
    expect(markdownAST).toMatchSnapshot({})

    return markdownAST
  })
}

module.exports = {
  testPlugin,
}
