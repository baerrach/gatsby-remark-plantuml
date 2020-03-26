const testRemarkPlugin = require(`./test-remark-plugin`)
const { PlantUmlError } = require(`../index`)

describe(`Error Handling`, () => {
  beforeEach(() => {
    jest.resetModules()
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

  it(`reports line numbers`, async () => {
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
})
