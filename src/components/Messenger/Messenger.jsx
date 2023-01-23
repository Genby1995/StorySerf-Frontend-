import React from "react";
import s from "./Messenger.module.css";
import DialogMessage from './DialogMessage/DialogMessage'
import DialogCompanion from "./DialogCompanion/DialogCompanion"
import DialogInputContainer from "./DialogInput/DialogInputContainer";

const Messenger = (props) => {


  let companionsElemements = props.state.companionsData.map((companion) => <DialogCompanion
    key={companion.id}
    name={companion.name}
    id={companion.id}
    avatar={companion.avatar}
  />)

  let messagesElemements = props.state.messagesData.map((message) => <DialogMessage
    key={message.id}
    messageContent={message.content}
    id={message.id}
  />)

  return (

    <div>
      <div className={s.notready}>ЭТО МАКЕТ. РАЗДЕЛ НЕ ГОТОВ</div>
      <div className={s.messenger}>
        <div className={s.dialogs}>
          {companionsElemements}
        </div>
        <div className={s.messagesWrapper}>
          <div className={s.messages}> {messagesElemements} </div>
          <DialogInputContainer />
        </div>
      </div>
    </div >
  )
}

export default Messenger;