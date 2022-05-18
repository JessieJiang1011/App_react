import React,{Component} from 'react';


class Register extends Component {
    constructor(props){
      super(props);
      this.state = {
        
      };
    }

    

    render(){
      return(
        <>
            <form class="form-Reigester">
            <h4 class="h3 mb-3 font-weight-normal grey">Register</h4>
            <input name="name" type="text" id="inputname" class="form-control" placeholder="Name" />
            <input name="email" type="email"  class="form-control" placeholder="Email address" />
            <input name="password" type="password"  class="form-control" placeholder="Password" />
            <button class="btn btn-md btn-success btn-block" type="submit">Register</button>
        </form>
        </>
      );
    }
}
  
export default Register;
  