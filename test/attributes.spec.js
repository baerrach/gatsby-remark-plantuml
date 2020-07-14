const cheerio = require(`cheerio`)
const testRemarkPlugin = require(`./test-remark-plugin`)

const attrString = (attributes) => (attributes ? ` ${attributes}` : ``)
const buildCode = (attributes = null) => `
\`\`\`plantuml${attrString(attributes)}
@startuml

box "Machine" #ffffff
    participant Sensor
    participant "OPC UA Server"
    participant CloudConnector
end box

box "some company" #ffffff
    participant "some company Core"
end box

box "Connector" #00ff8c
    participant "Event Hub"
    participant "Event Hub Processor Function"
    participant "IFTTT Event Processor"
end box

box "IFTTT" #ffffff
    participant "Webhook Service"
    participant Applet
end box

Sensor->"OPC UA Server" : Event
"OPC UA Server"->CloudConnector: Item Data
CloudConnector->"some company Core" : Item Data
"some company Core"->"Event Hub" : Event
"Event Hub"->"Event Hub Processor Function" : Events
"Event Hub Processor Function"->"Webhook Service" : POST Request
"Webhook Service"->Applet : Trigger

Applet->"Webhook Service": Action
"Webhook Service"->"IFTTT Event Processor" : POST Request
"IFTTT Event Processor"->"some company Core" : Commanding Call (POST Request)
"some company Core"->CloudConnector : Command
CloudConnector->"OPC UA Server" : Command
"OPC UA Server"->Sensor : Event

@enduml
\`\`\`
`

describe(`svg attributes`, () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`defaults to max-width: 100% and height: auto`, async () => {
    const ast = await testRemarkPlugin.testPlugin({
      code: buildCode(),
    })

    const $ = cheerio.load(ast.children[0].value)
    expect($(`svg`).get(0).tagName).toEqual(`svg`)
    expect($(`svg`).attr(`style`)).toBe(`max-width: 100%; height: auto;`)
  })

  it(`uses pluginOptions.attributes when provided`, async () => {
    const style = `width: 90vw; height: auto;`
    const ast = await testRemarkPlugin.testPlugin({
      code: buildCode(),
      options: {
        attributes: `style="${style}"`,
      },
    })

    const $ = cheerio.load(ast.children[0].value)
    expect($(`svg`).get(0).tagName).toEqual(`svg`)
    expect($(`svg`).attr(`style`)).toBe(style)
  })

  it(`uses code fence inline custom attributes`, async () => {
    const style = `max-width: 50%; height: auto;`
    const ast = await testRemarkPlugin.testPlugin({
      code: buildCode(`style="${style}"`),
    })

    const $ = cheerio.load(ast.children[0].value)
    expect($(`svg`).get(0).tagName).toEqual(`svg`)
    expect($(`svg`).attr(`style`)).toBe(style)
  })

  it(`inline code fence attributes override pluginOptions.attributes`, async () => {
    const style = `max-width: 50%; height: auto;`
    const ast = await testRemarkPlugin.testPlugin({
      code: buildCode(`style="${style}"`),
      options: {
        attributes: `style="width: 90vw; height: auto;"`,
      },
    })

    const $ = cheerio.load(ast.children[0].value)
    expect($(`svg`).get(0).tagName).toEqual(`svg`)
    expect($(`svg`).attr(`style`)).toBe(style)
  })

  it(`inline code fence can set css class`, async () => {
    const className = `plantuml-diagram`
    const ast = await testRemarkPlugin.testPlugin({
      code: buildCode(`class="${className}"`),
    })

    const $ = cheerio.load(ast.children[0].value)
    expect($(`svg`).get(0).tagName).toEqual(`svg`)
    expect($(`svg`).attr(`class`)).toBe(`plantuml-diagram`)
  })
})
