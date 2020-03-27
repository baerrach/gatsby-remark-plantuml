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
})
