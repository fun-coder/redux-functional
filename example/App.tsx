import { Component, default as React } from "react";
import { HomePage } from "./Home";

interface AppProps {
}

export class App extends Component {
  state = {};

  render() {
    return <div >
      <HomePage />
    </div>
  }
}