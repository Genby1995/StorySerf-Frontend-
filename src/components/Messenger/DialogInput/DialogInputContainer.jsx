import DialogInput from "./DialogInput";
import { messageOnChange_AC, messageOnSend_AC } from '../../../redux/messengerReducer'
import { connect } from "react-redux";

let mapStateToProps = (state) => {

  return {
    state: state.messenger.dialogInput,
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    messageOnChange_AC(text) {
      dispatch(messageOnChange_AC(text));
    },
    messageOnSend_AC() {
      dispatch(messageOnSend_AC());
    },
  }
}

const DialogInputContainer = connect(mapStateToProps, mapDispatchToProps)(DialogInput)

export default DialogInputContainer;
