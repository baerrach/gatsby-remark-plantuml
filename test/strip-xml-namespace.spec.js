const cheerio = require(`cheerio`)
const testRemarkPlugin = require(`./test-remark-plugin`)

const code = `
\`\`\`plantuml
@startuml

note
  this contains */ which is a html comment
  and will cause MDX to fail to process it
end note

@enduml
\`\`\`
`

describe(`Strip XML namespace`, () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`option defaults to true`, async () => {
    const ast = await testRemarkPlugin.testPlugin({
      code,
    })

    const $ = cheerio.load(ast.children[0].value)

    expect($(`svg`).attr(`xmlns`)).toBeUndefined()
    expect($(`svg`).attr(`link`)).toBeUndefined()
  })
})
