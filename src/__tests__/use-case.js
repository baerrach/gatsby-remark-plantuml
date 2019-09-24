// See http://plantuml.com/use-case-diagram

const testRemarkPlugin = require(`../../test/test-remark-plugin`)

describe(`Use Case`, () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`Usecases`, async () => {
    const code = `
\`\`\`plantuml
@startuml

(First usecase)
(Another usecase) as (UC2)
usecase UC3
usecase (Last\\nusecase) as UC4

@enduml
\`\`\`
`

    await testRemarkPlugin.testPlugin({
      code,
    })
  })
})
