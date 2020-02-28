const testRemarkPlugin = require(`./test-remark-plugin`)

describe(`issues-9`, () => {
  it(`https://github.com/baerrach/gatsby-remark-plantuml/ handles Japanese characters`, async () => {
    const code = `
\`\`\`plantuml
@startuml
entity "オペレーター\\noperators" as operators {
        * **operator_code**: char(10), AUTOINCREMENT
        --
        * **user_id**: bigserial [FK]
        * employee_number: integer, 共通社員番号
        * role: char, オペレーターの役職
        * type: char, L2L3振り分け
        is_leaving: boolean, default: false, 離席中かどうか
        notification_available_delay: boolean, default: true, 対応遅延時通知の ON/OFF
        notification_available_new: boolean, default: true, 新規入信通知の ON/OFF
        notification_available_response: boolean, default: true, 返信時通知の ON/OFF
        delay_notification_time: time, 遅延時通知時間
        max_acceptable_items: smallserial, default: 20, 受可上限値
        created_at: timestamp, default: CURRENT_TIMESTAMP
        updated_at: timestamp, default: CURRENT_TIMESTAMP
        deleted_at: timestamp, default: null
}
@enduml
\`\`\`
`
    await testRemarkPlugin.testPlugin({
      code,
    })
  })
})
