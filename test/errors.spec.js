const testRemarkPlugin = require(`./test-remark-plugin`)
const { PlantUmlError } = require(`../index`)

describe(`Error Handling`, () => {
  beforeEach(() => {
    jest.resetModules()
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
            expect.toMatchPlantUmlError(
              new PlantUmlError(`Syntax Error`, 1, ``)
            ),
          ],
        ],
      },
    })
  })
})
