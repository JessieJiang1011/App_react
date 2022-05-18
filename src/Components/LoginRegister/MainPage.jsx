import React, {Component} from 'react';

import Login from './Login';
import Register from './Register';

const PORT = process.env.PORT || 4000;
const URL_backend = `http://localhost:${PORT}/api/users/`;


class LoginRegister extends Component {
    
  constructor(props){
    super(props);
    this.state = { 
        
     };
  }



  render(){
    return(
      <React.Fragment>
          <center>
            <section class="Specific">
            <div class="main" id="main">
            <div class="container">
                <div class="row">
                <div class="col-lg-12 col-md-12">
                    <Login props={this.props} URL_backend={this.URL_backend} />
                    <Register props={this.props} URL_backend={this.URL_backend} />
                </div>
                
                </div>
            </div>
            </div>
            </section>
        </center>
  
      </React.Fragment>
    );
  }
}

export default LoginRegister;