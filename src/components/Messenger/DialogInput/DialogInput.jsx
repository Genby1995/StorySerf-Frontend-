import React from "react";
import s from "./DialogInput.module.css";


const DialogInput = (props) => {

  let form = React.createRef();
  let messageText = React.createRef();

  function messageOnChange(e) {
    let text = messageText.current.value;
    props.messageOnChange_AC(text);
  }

  function messageOnSend(e) {
    e.preventDefault();
    props.messageOnSend_AC();
  }

  return (
    <form onSubmit={(e) => messageOnSend(e)} className={s.wrapper} ref={form} name="form">
      <textarea
                onChange={messageOnChange}
                ref={messageText}
                name="messageText"
                className={s.input} rows="2"
                value={props.state.newMessageText}
                placeholder="Напишите сообщение...">
                </textarea>
      <input
            type="submit"
            name="submit"
            className={s.sendButton}
            value="Отправить">
           </input>
    </form>
  )
}

export default DialogInput;
