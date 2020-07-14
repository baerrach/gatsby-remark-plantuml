const testRemarkPlugin = require(`./test-remark-plugin`)

describe(`dot code`, () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`renders`, async () => {
    const code = `
\`\`\`plantuml
digraph G {
node [shape="box"]
A [label="hello",shape="circle"]
A->B->C
A->C
label="Title"
}
\`\`\`
`

    await testRemarkPlugin.testPlugin({
      code,
    })
  })
})
