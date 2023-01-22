import React from "react";
import s from "./DialogMessage.module.css";

const DialogMessage = (props) => {

    return(
        <div className={s.messageMy}>{props.messageContent}</div>
    )
}

export default DialogMessage;
