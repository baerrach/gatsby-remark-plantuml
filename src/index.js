"use strict"

const Promise = require(`bluebird`)
const path = require(`path`)
const { spawn } = require(`child_process`)
const hasbin = require(`hasbin`)
const visit = require(`unist-util-visit`)
const { StringStream, readableToString, onExit } = require(`@rauschma/stringio`)

class Configuration {
  constructor() {
    this.hasJava = false
    this.hasGraphViz = false
    this.hasNotRun = true
    this.plantumljar = path.resolve(
      __dirname,
      `./lib/plantuml-jar-mit-1.2019.9/plantuml.jar`
    )
  }

  init({ pluginOptions, reporter }) {
    this.reporter = reporter
    if (this.hasNotRun) {
      if (pluginOptions.plantumljar) {
        this.planumljar = path.resolve(pluginOptions.plantumljar)
      }

      this.hasNotRun = false
      this.hasJava = this.checkForJava()
      this.hasGraphViz = this.checkForGraphVis()
    }
  }

  checkForJava() {
    return hasbin.sync(`java`)
  }

  checkForGraphVis() {
    return hasbin.sync(`dot`)
  }

  check() {
    return this.hasJava && this.hasGraphViz
  }

  logNoExecutable(exe) {
    this.reporter.warn(`Executable '${exe}' not found on path`)
  }

  logJavaProblems() {
    if (!this.hasJava) {
      this.logNoExecutable(`java`)
    }
  }

  logGraphVizProblems() {
    if (!this.hasGraphViz) {
      this.logNoExecutable(`dot`)
    }
  }

  logProblems() {
    this.logJavaProblems()
    this.logGraphVizProblems()
  }
}

const configuration = new Configuration()

const plantuml = async (gatsbyNodeHelpers, pluginOptions = {}) => {
  const { markdownAST, reporter } = gatsbyNodeHelpers
  const plantUmlNodes = []

  const runplantuml = async diagramAsText => {
    const plantumlProcess = spawn(`java`, [
      `-jar`,
      configuration.plantumljar,
      `-Dfile.encoding=utf8`,
      `-pipe`,
      `-tsvg`,
    ])

    const diagramAsStream = new StringStream(diagramAsText)

    const [stdout, stderr] = await Promise.all([
      readableToString(plantumlProcess.stdout),
      readableToString(plantumlProcess.stderr),
      diagramAsStream.pipe(plantumlProcess.stdin),
    ])

    if (stderr.length) {
      throw new Error(stderr)
    }

    await onExit(plantumlProcess)

    return stdout
  }

  configuration.init({ pluginOptions, reporter })

  visit(markdownAST, `code`, node => {
    // Visit must be SYNC
    // See https://www.huy.dev/2018-05-remark-gatsby-plugin-part-3/
    //
    // Gatsby Remark Images also shows how to do async code in transformers.
    // https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-images/src/index.js
    if (node.lang === `plantuml`) {
      plantUmlNodes.push(node)
    }
  })

  if (plantUmlNodes.length === 0) {
    return
  }

  if (!configuration.check()) {
    configuration.logProblems()
    return
  }

  const generateUmlAndUpdateNode = async node => {
    try {
      const diagramAsPlantUml = node.value
      const diagramAsSvg = await runplantuml(diagramAsPlantUml)

      node.type = `html`
      node.lang = undefined
      node.children = undefined
      node.value = diagramAsSvg
    } catch (err) {
      reporter.error(`Could not generate plantuml diagram`, err)
    }
  }

  await Promise.each(plantUmlNodes, node => generateUmlAndUpdateNode(node))
}

module.exports = plantuml
