const testRemarkPlugin = require(`../../test/test-remark-plugin`)

describe(`remark plantuml plugin`, () => {
  beforeEach(() => {
    jest.resetModules()
  })

  describe(`ignores codeblocks that are not plantuml`, () => {
    it(`with lang=''`, async () => {
      const code = `\`\`\`\n// Fake\n\`\`\``
      await testRemarkPlugin.testPlugin({
        code,
      })
    })

    it(`with lang='js'`, async () => {
      const code = `\`\`\`js\n// Fake\n\`\`\``

      await testRemarkPlugin.testPlugin({
        code,
      })
    })

    it.only(`fails the build when can't find Java and Graphviz`, async () => {
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
      try {
        await testRemarkPlugin.testPlugin({
          code,
          reporter: {
            warn: [
              `Executable 'java' not found on path`,
              `Executable 'dot' not found on path`,
            ],
          },
        })
      } finally {
        process.env.PATH = path
      }
    })
  })
})
