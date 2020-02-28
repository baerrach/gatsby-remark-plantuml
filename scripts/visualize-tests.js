const _ = require(`lodash`)

const fs = require(`fs-extra`)
const path = require(`path`)
const basedir = __dirname
const snapshotsdir = path.join(basedir, `../test/__snapshots__`)
const svgdir = path.join(basedir, `../svg`)

const snapshotFilenames = fs
  .readdirSync(snapshotsdir)
  .filter(file => path.extname(file) === `.snap`)
  .map(file => path.join(snapshotsdir, file))

if (!fs.existsSync(svgdir)) {
  fs.mkdirSync(svgdir)
}

const writeVisualizedTest = (htmlFilename, svg) => {
  const html = `
<html>
  <head></head>
  <body>
${svg}
  </body>
</html>
`

  console.log(`Writing svg ${htmlFilename}`)
  fs.writeFileSync(htmlFilename, html)
}

const extractSvg = data => {
  const svgRegExp = /(<svg (?:[^\\"]|\\")*)/m

  const results = svgRegExp.exec(data)

  if (results === null) {
    return undefined
  }

  // The Jest `pretty-format` string has escaped double quotes, unescape them.
  const svg = results[0].replace(/\\"/g, `"`)
  return svg
}

const visualizeSnapshotFile = snapshotFilename => {
  const snapshot = require(snapshotFilename)

  /*
    Jest Snapshot v1, https://goo.gl/fbAQLP
    https://jestjs.io/docs/en/snapshot-testing

    The Snapshot file pretty-formats the snapshot object into a string and saves
    it into the default export with the key equal to the current test name.

    There is nothing to `deserialize` this format.

    Since visualizing the svg output of the snapshots is a rare task this is a
    hack with regular expressions.
  */

  const testSnapshotPairs = _.toPairs(snapshot)

  _.forEach(testSnapshotPairs, ([testName, data]) => {
    const svg = extractSvg(data)

    if (svg) {
      const sanitizedTestName = _.kebabCase(testName)
      const htmlFilename = path.join(svgdir, `${sanitizedTestName}.html`)

      writeVisualizedTest(htmlFilename, svg)
    }
  })
}

_.forEach(snapshotFilenames, visualizeSnapshotFile)
