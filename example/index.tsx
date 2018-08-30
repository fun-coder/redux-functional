import * as React from "react";
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { App } from "./App";

const store = createStore(() => 1, applyMiddleware());

ReactDOM.render(
  <Provider store={ store }>
    <App/>
  </Provider>,
  document.getElementById('applicationRoot')
);