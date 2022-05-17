import React, {Component} from 'react';
import './App.css';
import Nav from './Components/Nav/Nav';
import Main from './Components/GitHub/Main';
import Specific from './Components/GitHub/Specific';
import Data from './Components/GitHub/Data';
import Favorite from './Components/Favorite/Favorite';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Provider } from 'react-redux';

// Store
import {createStore} from 'redux';
import rootReducer from './Store/Reducers';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {  };

    // create store
    this.store = createStore(
      rootReducer,
      window.__REDUX_DEVTOOLS_EXTENSION__&&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  }
  render(){
    return(
      <React.Fragment>
        <Provider store={this.store}>

        <Router forceRefresh={true}>
          <Nav store={this.store} />
          <Route exact path='/Data/:id' component={Data} />
          <Route exact path='/Specific/:login' component={Specific} />
          <Route exact path='/Favorite' component={Favorite} />
          <Route exact path='/' component={Main} />

        </Router>
        </Provider>
        
      </React.Fragment>
    );
  }
}

export default App;
