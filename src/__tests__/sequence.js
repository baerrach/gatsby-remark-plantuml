// See http://plantuml.com/sequence-diagram

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

describe(`remark plantuml plugin - sequence diagrams`, () => {
  beforeEach(() => {
    jest.resetModules()
    plugin = require(`../index`)
  })

  it(`Basic examples`, async () => {
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
    await plugin({ markdownAST, reporter })
    expect(markdownAST).toMatchSnapshot()
    expect(reporter.info).not.toHaveBeenCalled()
    expect(reporter.warn).not.toHaveBeenCalled()
    expect(reporter.error).not.toHaveBeenCalled()
    expect(reporter.panic).not.toHaveBeenCalled()
    expect(reporter.panicOnBuild).not.toHaveBeenCalled()
  })
})
