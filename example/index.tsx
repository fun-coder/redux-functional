import * as React from "react";
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { Process } from "../src/process";
import { App } from "./App";
import { TaskModule } from "./modules/task";

const reducer = combineReducers({
  [TaskModule.name]: TaskModule.reducers
});

const store = createStore(reducer, applyMiddleware(Process.register));

ReactDOM.render(
  <Provider store={ store }>
    <App/>
  </Provider>,
  document.getElementById('applicationRoot')
);