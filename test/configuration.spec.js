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

    it("handles JAVA_OPTS", () => {
      const JAVA_OPTS = [
        `-Dapple.laf.useScreenMenuBar=true`,
        `-Dplantuml.include.path=\${OMNICRON_WIKI_WORKSPACE}/src/plantuml/include:\${OMNICRON_WIKI_WORKSPACE}/src/plantuml/:$HOME/git`,
        `-DPLANTUML_LIMIT_SIZE=24384`,
        `-Xmx1024M`,
      ]
      const out = new Configuration()
      out.init({
        pluginOptions: {
          JAVA_OPTS,
        },
      })

      const actual = out.getCommandLineArguments()
      const expected = [
        `-Djava.awt.headless=true`,
        ...JAVA_OPTS,
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
