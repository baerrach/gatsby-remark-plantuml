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

  it(`Actors`, async () => {
    const code = `
\`\`\`plantuml
@startuml

:First Actor:
:Another\\nactor: as Men2
actor Men3
actor :Last actor: as Men4

@enduml
\`\`\`
`

    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Usecases description`, async () => {
    const code = `
\`\`\`plantuml
@startuml

usecase UC1 as "You can use
several lines to define your usecase.
You can also use separators.
--
Several separators are possible.
==
And you can add titles:
..Conclusion..
This allows large description."

@enduml
\`\`\`
`

    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Basic example`, async () => {
    const code = `
\`\`\`plantuml
@startuml

User -> (Start)
User --> (Use the application) : A small label

:Main Admin: ---> (Use the application) : This is\\nyet another\\nlabel

@enduml
\`\`\`
`

    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Extension`, async () => {
    const code = `
\`\`\`plantuml
@startuml
:Main Admin: as Admin
(Use the application) as (Use)

User <|-- Admin
(Start) <|-- (Use)

@enduml
\`\`\`
`

    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Using notes`, async () => {
    const code = `
\`\`\`plantuml
@startuml
:Main Admin: as Admin
(Use the application) as (Use)

User -> (Start)
User --> (Use)

Admin ---> (Use)

note right of Admin : This is an example.

note right of (Use)
  A note can also
  be on several lines
end note

note "This note is connected\\nto several objects." as N2
(Start) .. N2
N2 .. (Use)
@enduml
\`\`\`
`

    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Stereotypes`, async () => {
    const code = `
\`\`\`plantuml
@startuml
User << Human >>
:Main Database: as MySql << Application >>
(Start) << One Shot >>
(Use the application) as (Use) << Main >>

User -> (Start)
User --> (Use)

MySql --> (Use)

@enduml
\`\`\`
`

    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  describe(`Changing arrows direction`, () => {
    it(`Example 1`, async () => {
      const code = `
\`\`\`plantuml
@startuml
:user: --> (Use case 1)
:user: -> (Use case 2)
@enduml
\`\`\`
`

      await testRemarkPlugin.testPlugin({
        code,
      })
    })

    it(`Example 2`, async () => {
      const code = `
\`\`\`plantuml
@startuml
(Use case 1) <.. :user:
(Use case 2) <- :user:
@enduml
\`\`\`
`

      await testRemarkPlugin.testPlugin({
        code,
      })
    })

    it(`Example 3`, async () => {
      const code = `
\`\`\`plantuml
@startuml
:user: -left-> (dummyLeft)
:user: -right-> (dummyRight)
:user: -up-> (dummyUp)
:user: -down-> (dummyDown)
@enduml
\`\`\`
`

      await testRemarkPlugin.testPlugin({
        code,
      })
    })
  })
})
