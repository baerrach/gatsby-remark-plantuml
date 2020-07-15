const { Configuration } = require(`../index`)

describe("Configuration", () => {
  describe("getCommandLineArguments", () => {
    it("default configuration", () => {
      const out = new Configuration()
      out.init({ pluginOptions: {} })

      const actual = out.getCommandLineArguments()
      const expected = [
        `-Djava.awt.headless=true`,
        `-jar`,
        out.plantumljar,
        `-charset`,
        `UTF-8`,
        `-Dfile.encoding=utf8`,
        `-pipe`,
        `-pipeNoStderr`,
        `-tsvg`,
      ]

      expect(actual).toEqual(expected)
    })
  })
})
