const testRemarkPlugin = require(`./test-remark-plugin`)
const { PlantUmlError } = require(`../index`)

describe(`Error Handling`, () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`fails the build when can't find Java and Graphviz`, async () => {
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

  it(`fails the build when can't find plantuml`, async () => {
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
      reporter: {
        error: [
          [
            `Could not generate plantuml diagram:  `,
            new Error(
              `Error: Unable to access jarfile C:\\ide\\gatsby-remark-plantuml\\lib\\plantuml-does-not-exist.jar\r\n`
            ),
          ],
        ],
      },
      options: {
        plantumljar: `./lib/plantuml-does-not-exist.jar`,
      },
    })
  })

  describe(`reports line numbers`, () => {
    it(`on syntax errors`, async () => {
      const code = `
\`\`\`plantuml
@startuml
error here // first line is #1 after @startuml
@enduml
\`\`\`
`

      await testRemarkPlugin.testPlugin({
        code,
        reporter: {
          error: [
            [
              `Could not generate plantuml diagram: Syntax Error at line 1  `,
              new PlantUmlError(`Syntax Error`),
            ],
          ],
        },
      })
    })

    it(`on missing closing quotes`, async () => {
      const code = `
\`\`\`plantuml
@startuml
Alice -> Bob
Bob --> "missing closing quote
@enduml
\`\`\`
`

      await testRemarkPlugin.testPlugin({
        code,
        reporter: {
          error: [
            [
              `Could not generate plantuml diagram: Syntax Error at line 2  `,
              new PlantUmlError(`Syntax Error`),
            ],
          ],
        },
      })
    })
  })
})
