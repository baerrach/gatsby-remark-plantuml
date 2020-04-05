const cheerio = require(`cheerio`)

const testRemarkPlugin = require(`./test-remark-plugin`)

const code = `
\`\`\`plantuml
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

describe(`maxWidth Option`, () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`when not specified defaults to width and height of the viewBox`, async () => {
    const ast = await testRemarkPlugin.testPlugin({
      code,
    })

    const $ = cheerio.load(ast.children[0].value)
    expect($(`svg`).get(0).tagName).toEqual(`svg`)
    const [_x, _y, viewboxWidth, viewboxHeight] = $(`svg`)
      .attr(`viewBox`)
      .split(` `)
    expect(`${viewboxWidth}px`).toBe($(`svg`).attr(`width`))
    expect(`${viewboxHeight}px`).toBe($(`svg`).attr(`height`))
  })

  it(`overrides svg.width and svg.height but viewbox is unaltered`, async () => {
    const ast = await testRemarkPlugin.testPlugin({
      code,
      options: {
        maxWidth: `90vw`,
      },
    })

    const $ = cheerio.load(ast.children[0].value)
    expect($(`svg`).get(0).tagName).toEqual(`svg`)
    const [_x, _y, viewboxWidth, viewboxHeight] = $(`svg`)
      .attr(`viewBox`)
      .split(` `)
    expect(viewboxWidth).toBe(`1250`)
    expect(viewboxHeight).toBe(`509`)
    expect($(`svg`).attr(`width`)).toBe(`90vw`)
    expect($(`svg`).attr(`height`)).toBe(`auto`)
  })
})
