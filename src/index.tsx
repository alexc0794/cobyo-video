import React from 'react';
import ReactDOM from 'react-dom';
import App from 'src/App';
import { Provider } from 'react-redux';
import store from 'src/redux/store'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
