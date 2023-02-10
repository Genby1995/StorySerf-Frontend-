import Messenger from "./Messenger";
import { connect } from "react-redux";

let mapStateToProps = (state) => {
    return {
      state: state.messenger,
    }
  };
  
  let mapDispatchToProps = (dispatch) => {
    return {

    }
  };

const MessengerContainer = connect(mapStateToProps, mapDispatchToProps)(Messenger)

export default MessengerContainer;