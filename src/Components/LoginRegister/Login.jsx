import React,{Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {  ReUserState } from '../../Store/Actions';

class Login extends Component {
    constructor(props){
      super(props);
      this.state = {
        email:'', password:'', errors:''
      };
    }

    onChange = (e) =>{ this.setState({[e.target.name]: e.target.value})}

    Login = (e)=>{
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value});
        const Data = {password:this.state.password, email:this.state.email};
        axios.post(`${this.props.URL_backend}/Login`, {Data})
        .then((res)=>{
            if(res['data']){
                // successfully 
                localStorage.setItem('token', res.data.Token);
                this.props.ReUserState(true);
                this.props.props.history.push('/Profile')
            }
            if(res['message']){
                // fail
                const err = res.data.message;
                this.setState({errors:err})
            }
        })
        .catch(err => console.log(err));
    }

    render(){
      return(
        <>
        {this.state.errors ? <i className='alert alert-danger'>
            {this.state.errors}
        </i>: '' }
        <hr></hr>
            <form class="form-signin">
            <h4 class="h3 mb-3 font-weight-normal grey">Please sign in</h4>
            <input value={this.state.email} onChange={this.onChange} name="email" type="email"  class="form-control" placeholder="Email address" />
            <input value={this.state.password} onChange={this.onChange} name="password" type="password"  class="form-control" placeholder="Password" />
            <button onClick={this.Login} class="btn btn-md btn-primary btn-block" type="submit">Sign in</button>
        </form>
        </>
      );
    }
}

Login.propTypes = {
    ReUserState: PropTypes.func.isRequired,
    Users: PropTypes.object.isRequired
}

const mapToProps = (state) =>({
    Users:state.users
})

  
export default connect(mapToProps,{ReUserState}) (Login);
  