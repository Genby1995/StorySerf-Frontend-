//Constants
const NEW_MESSAGE_SEND = 'NEW_MESSAGE_SEND';
const NEW_MESSAGE_CHANGE = 'NEW_MESSAGE_CHANGE';

//Initialization
let initialState = {
    companionsData: [
        {id:"1", name: "Антонио", avatar: "../../../img/avatar_andr.jpg"},
        {id: "2", name: "Инлесиас", avatar: "../../../img/avatar_igor.jpg"},
        {id:"3", name:"Саманта", avatar: "../../../img/avatar_svet.jpg"}, 
        {id:"4", name:"Эндрю", avatar: "../../../img/avatar_ant.jpg"},
    ],
    
    messagesData: [
        {id:"11", content: "Привет! Как дела?"},
        {id:"12", content: "Привет! Нормально, у тебя как?"},
        {id:"13", content: "Хорошо. Пойдём гулять?"}, 
        {id:"14", content:"Да, пошли! Только сначала мне нужно сделать пару дел, а имменно: Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores recusandae, adipisci minus quo incidunt aspernatur iste repellat at voluptate numquam beatae, quasi velit ipsa facere, eaque animi deserunt possimus. Nostrum."},
    ],

    dialogInput:{
        newMessageText: '',
    },
}

// Reducer
function messengerReducer (state = initialState, action) {

    switch(action.type) {
        
        case NEW_MESSAGE_SEND:
            let value = state.dialogInput.newMessageText;    
        
            return {
                ...state,
                messagesData: [...state.messagesData, {id: 5, content: value}],
                dialogInput: {
                    ...state.dialogInput,
                    newMessageText: '',
                },
            };

        case NEW_MESSAGE_CHANGE:
            return {
                ...state,
                dialogInput: {
                    ...state.dialogInput,
                    newMessageText: action.text
                },
            };
        
        default:
            return state;
    }
}

// Action Creators
export function messageOnChange_AC (text) {
    return {
        type: "NEW_MESSAGE_CHANGE",
        text: text,
    }
}

export  function messageOnSend_AC () {
    return {
        type: "NEW_MESSAGE_SEND",
    }
}

// Exports
export default messengerReducer;