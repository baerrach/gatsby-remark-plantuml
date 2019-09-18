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

let plugin

beforeEach(() => {
  Object.keys(reporter).forEach(key => reporter[key].mockReset())
})

describe(`remark plantuml plugin`, () => {
  beforeEach(() => {
    jest.resetModules()
    plugin = require(`../index`)
  })

  describe(`ignores codeblocks that are not plantuml`, () => {
    it(`with lang=''`, () => {
      const code = `\`\`\`\n// Fake\n\`\`\``
      const markdownAST = remark.parse(code)
      return plugin({ markdownAST, reporter }).then(() => {
        expect(markdownAST).toMatchSnapshot()
        expect(reporter.info).not.toHaveBeenCalled()
        expect(reporter.warn).not.toHaveBeenCalled()
        expect(reporter.error).not.toHaveBeenCalled()
        expect(reporter.panic).not.toHaveBeenCalled()
        expect(reporter.panicOnBuild).not.toHaveBeenCalled()
      })
    })

    it(`with lang='js'`, () => {
      const code = `\`\`\`js\n// Fake\n\`\`\``
      const markdownAST = remark.parse(code)
      return plugin({ markdownAST, reporter }).then(() => {
        expect(markdownAST).toMatchSnapshot()
        expect(reporter.info).not.toHaveBeenCalled()
        expect(reporter.warn).not.toHaveBeenCalled()
        expect(reporter.error).not.toHaveBeenCalled()
        expect(reporter.panic).not.toHaveBeenCalled()
        expect(reporter.panicOnBuild).not.toHaveBeenCalled()
      })
    })
  })

  it(`fails the build when can't find Java and Graphviz`, () => {
    const path = process.env.PATH
    process.env.PATH = `` // an empty PATH won't find any files
    const code = `
\`\`\`plantuml
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: Another authentication Response
@enduml
\`\`\`
`
    const markdownAST = remark.parse(code)
    return plugin({ markdownAST, reporter })
      .then(() => {
        expect(markdownAST).toMatchSnapshot()
        expect(reporter.info).not.toHaveBeenCalled()
        expect(reporter.warn).toHaveBeenCalledTimes(2)
        expect(reporter.warn).toHaveBeenNthCalledWith(
          1,
          `Executable 'java' not found on path`
        )
        expect(reporter.warn).toHaveBeenNthCalledWith(
          2,
          `Executable 'dot' not found on path`
        )
        expect(reporter.error).not.toHaveBeenCalled()
        expect(reporter.panic).not.toHaveBeenCalled()
        expect(reporter.panicOnBuild).not.toHaveBeenCalled()
      })
      .finally(() => {
        process.env.PATH = path
      })
  })
})
