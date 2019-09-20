expect.extend({
  toReport(reporter, expected) {
    if (!expected) {
      expect(reporter).not.toHaveBeenCalled()
    } else {
      expect(reporter).toHaveBeenCalledTimes(expected.length)
      expected.forEach((message, index) => {
        const nthCall = index + 1
        expect(reporter).toHaveBeenNthCalledWith(nthCall, message)
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

  const remark = require(`remark`)
  const reporter = require(`gatsby-cli/lib/reporter`)

  const plugin = require(`../src/index`)

  const markdownAST = remark.parse(code)
  return plugin({ markdownAST, reporter }).then(() => {
    expect(markdownAST).toMatchSnapshot()
    expect(reporter.info).toReport(info)
    expect(reporter.warn).toReport(warn)
    expect(reporter.error).toReport(error)
    expect(reporter.panic).toReport(panic)
    expect(reporter.panicOnBuild).toReport(panicOnBuild)
  })
}

module.exports = {
  testPlugin,
}
