const path = require(`path`)

const testRemarkPlugin = require(`./test-remark-plugin`)

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
  })

  describe(`configuration`, () => {
    it(`plantumljar as absolute path`, async () => {
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
      await testRemarkPlugin.testPlugin({
        code,
        undefined,
        options: {
          plantumljar: path.resolve(
            __dirname,
            `../lib/plantuml-jar-mit-1.2019.9/plantuml.jar`
          ),
        },
      })
    })

    it(`plantumljar as relative path`, async () => {
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
      await testRemarkPlugin.testPlugin({
        code,
        undefined,
        options: {
          plantumljar: `./lib/plantuml-jar-mit-1.2019.9/plantuml.jar`,
        },
      })
    })
  })
})
