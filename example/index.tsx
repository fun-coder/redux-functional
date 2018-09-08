import * as React from "react";
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore, Dispatch } from 'redux';
import { App } from "./App";
import { TaskModule } from "./modules/task";
import { Process } from "../index";
import { composeWithDevTools } from "redux-devtools-extension";

const reducer = combineReducers({
  [TaskModule.name]: TaskModule.reducers
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(Process.register)));

ReactDOM.render(
  <Provider store={ store }>
    <App/>
  </Provider>,
  document.getElementById('applicationRoot')
);