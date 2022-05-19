import React, {Component} from 'react';
import './App.css';
import Nav from './Components/Nav/Nav';
import Main from './Components/GitHub/Main';
import Specific from './Components/GitHub/Specific';
import Data from './Components/GitHub/Data';
import Favorite from './Components/Favorite/Favorite';
import LoginRegister from './Components/LoginRegister/MainPage';
import Profile from './Components/Profile/Profile';
// private Route
import PrivateRoute from './PrivateRoute';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Provider } from 'react-redux';

// Action
import { ReUserState } from './Store/Actions';

// Store
import {createStore} from 'redux';
import rootReducer from './Store/Reducers';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthentication: false
    };

    // create store
    this.store = createStore(
      rootReducer,
      window.__REDUX_DEVTOOLS_EXTENSION__&&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  }

  // check if user is auth
  async componentDidMount(){
    if(localStorage.getItem('token')){
      this.store.dispatch(ReUserState(true));
      this.setState({isAuthentication:true})
    } else {
      this.store.dispatch(ReUserState(false));
      this.setState({isAuthentication:false})
    }
    await this.store.subscribe(()=>{
      this.setState({ isAuthentication: this.store.getState()['Users']['isAuthenticated'] })
    })
    console.log('state from App:', this.state.isAuthentication);
  }

  Logout = ()=>{
    // when we sign up successfully, will store our token with name 'token', which our server gives to us
    localStorage.removeItem('token');
    this.store.dispatch(ReUserState(false));
    this.setState({isAuthentication: false})
  }


  render(){
    return(
      <React.Fragment>
        <Provider store={this.store}>

        <Router forceRefresh={true}>
          <Nav Logout={this.Logout} store={this.store} />
          <Route exact path='/' component={Main} />
          <Route exact path='/Data/:id' component={Data} />
          <Route exact path='/Specific/:login' component={Specific} />
          <Route exact path='/Favorite' component={Favorite} />
          <Route exact path='/LoginRegister' component={LoginRegister} />
          <PrivateRoute exact path='/Profile' Logout={this.Logout} Auth={this.state.isAuthentication} component={Profile} />


        </Router>
        </Provider>
        
      </React.Fragment>
    );
  }
}

export default App;
