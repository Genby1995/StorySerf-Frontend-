//CSS
import './generalCSS/brightMode.css';
import './generalCSS/darkMode.css';
import './generalCSS/reset.css';
import './index.css';

//React
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

//REDUX
import { configureStore} from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from './redux/_rootReducer';


const root = ReactDOM.createRoot(document.getElementById('root'));

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

root.render(

      <Provider store={store}>
        <App />
      </Provider>

);


