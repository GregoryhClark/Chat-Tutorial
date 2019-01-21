import React, { Component } from 'react';
import ChatParent from "./Components/ChatParent";
// import {HashRouter, Route, Switch} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        {/* <HashRouter>
          <Switch>
            <Route exact path = '/' component={Home}/>
            <Route exact path = '/dash' component={Dash}/>
            <Route exact path = '/about' component={About}/>
          </Switch>
        </HashRouter> */}
          <ChatParent/>
      </div>
    );
  }
}

export default App;
