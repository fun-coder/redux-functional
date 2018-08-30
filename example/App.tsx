import { Component, default as React } from "react";
import { HomeContainer } from "./Home";

interface AppProps {

}

export class App extends Component {
  state = {};

  render() {
    return <div >
      <HomeContainer></HomeContainer>
    </div>
  }
}