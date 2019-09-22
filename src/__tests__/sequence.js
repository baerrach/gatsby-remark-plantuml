// See http://plantuml.com/sequence-diagram

const testRemarkPlugin = require(`../../test/test-remark-plugin`)
describe(`Sequence`, () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it(`Basic examples`, async () => {
    const code = `
\`\`\`plantuml
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: Another authentication Response
@enduml
\`\`\`
`

    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  describe(`Declaring participant`, () => {
    it(`Example 1`, async () => {
      const code = `
\`\`\`plantuml
@startuml
actor Foo1
boundary Foo2
control Foo3
entity Foo4
database Foo5
collections Foo6
Foo1 -> Foo2 : To boundary
Foo1 -> Foo3 : To control
Foo1 -> Foo4 : To entity
Foo1 -> Foo5 : To database
Foo1 -> Foo6 : To collections

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
actor Bob #red
' The only difference between actor
'and participant is the drawing
participant Alice
participant "I have a really\\nlong name" as L #99FF99
/' You can also declare:
   participant L as "I have a really\\nlong name"  #99FF99
  '/

Alice->Bob: Authentication Request
Bob->Alice: Authentication Response
Bob->L: Log transaction
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
participant Last order 30
participant Middle order 20
participant First order 10
@enduml
\`\`\`
`
      await testRemarkPlugin.testPlugin({
        code,
      })
    })
  })

  it(`Use non-letters in participants`, async () => {
    const code = `
\`\`\`plantuml
@startuml
Alice -> "Bob()" : Hello
"Bob()" -> "This is very\\nlong" as Long
' You can also declare:
' "Bob()" -> Long as "This is very\\nlong"
Long --> "Bob()" : ok
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Message to Self`, async () => {
    const code = `
\`\`\`plantuml
@startuml
Alice->Alice: This is a signal to self.\\nIt also demonstrates\\nmultiline \\ntext
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Change arrow style`, async () => {
    const code = `
\`\`\`plantuml
@startuml
Bob ->x Alice
Bob -> Alice
Bob ->> Alice
Bob -\\ Alice
Bob \\\\- Alice
Bob //-- Alice

Bob ->o Alice
Bob o\\\\-- Alice

Bob <-> Alice
Bob <->o Alice
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Change arrow color`, async () => {
    const code = `
\`\`\`plantuml
@startuml
Bob -[#red]> Alice : hello
Alice -[#0000FF]->Bob : ok
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  describe(`Message sequence numbering`, () => {
    it(`Example 1`, async () => {
      const code = `
\`\`\`plantuml
@startuml
autonumber
Bob -> Alice : Authentication Request
Bob <- Alice : Authentication Response
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
autonumber
Bob -> Alice : Authentication Request
Bob <- Alice : Authentication Response

autonumber 15
Bob -> Alice : Another authentication Request
Bob <- Alice : Another authentication Response

autonumber 40 10
Bob -> Alice : Yet another authentication Request
Bob <- Alice : Yet another authentication Response

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
autonumber "<b>[000]"
Bob -> Alice : Authentication Request
Bob <- Alice : Authentication Response

autonumber 15 "<b>(<u>##</u>)"
Bob -> Alice : Another authentication Request
Bob <- Alice : Another authentication Response

autonumber 40 10 "<font color=red><b>Message 0  "
Bob -> Alice : Yet another authentication Request
Bob <- Alice : Yet another authentication Response

@enduml
\`\`\`
`
      await testRemarkPlugin.testPlugin({
        code,
      })
    })

    it(`Example 4`, async () => {
      const code = `
\`\`\`plantuml
@startuml
autonumber 10 10 "<b>[000]"
Bob -> Alice : Authentication Request
Bob <- Alice : Authentication Response

autonumber stop
Bob -> Alice : dummy

autonumber resume "<font color=red><b>Message 0  "
Bob -> Alice : Yet another authentication Request
Bob <- Alice : Yet another authentication Response

autonumber stop
Bob -> Alice : dummy

autonumber resume 1 "<font color=blue><b>Message 0  "
Bob -> Alice : Yet another authentication Request
Bob <- Alice : Yet another authentication Response
@enduml
\`\`\`
`
      await testRemarkPlugin.testPlugin({
        code,
      })
    })
  })

  it(`Page Title, Header and Footer`, async () => {
    const code = `
\`\`\`plantuml
@startuml

header Page Header
footer Page %page% of %lastpage%

title Example Title

Alice -> Bob : message 1
Alice -> Bob : message 2

@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Splitting diagrams`, async () => {
    const code = `
\`\`\`plantuml
@startuml

Alice -> Bob : message 1
Alice -> Bob : message 2

newpage

Alice -> Bob : message 3
Alice -> Bob : message 4

newpage A title for the\\nlast page

Alice -> Bob : message 5
Alice -> Bob : message 6
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Grouping message`, async () => {
    const code = `
\`\`\`plantuml
@startuml
Alice -> Bob: Authentication Request

alt successful case

	Bob -> Alice: Authentication Accepted

else some kind of failure

	Bob -> Alice: Authentication Failure
	group My own label
		Alice -> Log : Log attack start
	    loop 1000 times
	        Alice -> Bob: DNS Attack
	    end
		Alice -> Log : Log attack end
	end

else Another type of failure

   Bob -> Alice: Please repeat

end
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Notes on messages`, async () => {
    const code = `
\`\`\`plantuml
@startuml
Alice->Bob : hello
note left: this is a first note

Bob->Alice : ok
note right: this is another note

Bob->Bob : I am thinking
note left
	a note
	can also be defined
	on several lines
end note
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Some other notes`, async () => {
    const code = `
\`\`\`plantuml
@startuml
participant Alice
participant Bob
note left of Alice #aqua
	This is displayed 
	left of Alice. 
end note
 
note right of Alice: This is displayed right of Alice.

note over Alice: This is displayed over Alice.

note over Alice, Bob #FFAAAA: This is displayed\\n over Bob and Alice.

note over Bob, Alice
	This is yet another
	example of
	a long note.
end note
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Changing notes shape`, async () => {
    const code = `
\`\`\`plantuml
@startuml
caller -> server : conReq
hnote over caller : idle
caller <- server : conConf
rnote over server
 "r" as rectangle
 "h" as hexagon
endrnote
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Creole and HTML`, async () => {
    const code = `
\`\`\`plantuml
@startuml
participant Alice
participant "The **Famous** Bob" as Bob

Alice -> Bob : hello --there--
... Some ~~long delay~~ ...
Bob -> Alice : ok
note left
  This is **bold**
  This is //italics//
  This is ""monospaced""
  This is --stroked--
  This is __underlined__
  This is ~~waved~~
end note

Alice -> Bob : A //well formatted// message
note right of Alice
 This is <back:cadetblue><size:18>displayed</size></back>
 __left of__ Alice.
end note
note left of Bob
 <u:red>This</u> is <color #118888>displayed</color>
 **<color purple>left of</color> <s:red>Alice</strike> Bob**.
end note
note over Alice, Bob
 <w:#FF33FF>This is hosted</w> by <img sourceforge.jpg>
end note
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Divider`, async () => {
    const code = `
\`\`\`plantuml
@startuml

== Initialization ==

Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

== Repetition ==

Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response

@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Reference`, async () => {
    const code = `
\`\`\`plantuml
@startuml
participant Alice
actor Bob

ref over Alice, Bob : init

Alice -> Bob : hello

ref over Bob
  This can be on
  several lines
end ref
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Delay`, async () => {
    const code = `
\`\`\`plantuml
@startuml

Alice -> Bob: Authentication Request
...
Bob --> Alice: Authentication Response
...5 minutes later...
Bob --> Alice: Bye !

@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  it(`Space`, async () => {
    const code = `
\`\`\`plantuml
@startuml

Alice -> Bob: message 1
Bob --> Alice: ok
|||
Alice -> Bob: message 2
Bob --> Alice: ok
||45||
Alice -> Bob: message 3
Bob --> Alice: ok

@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })

  describe(`Lifeline Activation and Destruction`, () => {
    it(`Example 1`, async () => {
      const code = `
\`\`\`plantuml
@startuml
participant User

User -> A: DoWork
activate A

A -> B: << createRequest >>
activate B

B -> C: DoWork
activate C
C --> B: WorkDone
destroy C

B --> A: RequestCreated
deactivate B

A -> User: Done
deactivate A

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
participant User

User -> A: DoWork
activate A #FFBBBB

A -> A: Internal call
activate A #DarkSalmon

A -> B: << createRequest >>
activate B

B --> A: RequestCreated
deactivate B
deactivate A
A -> User: Done
deactivate A

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
autoactivate on
alice -> bob : hello
bob -> bob : self call
bill -> bob #005500 : hello from thread 2
bob -> george ** : create
return done in thread 2
return rc
bob -> george !! : delete
return success
@enduml
\`\`\`
`
      await testRemarkPlugin.testPlugin({
        code,
      })
    })
  })
})
