import React,{Component} from 'react';
import axios from 'axios';

const PORT = process.env.PORT || 4000;
const URL_backend = `http://localhost:${PORT}/api/users`;

import { confirm as confirmComplex } from "./confirm";

class Profile extends Component {
    mounted = false;
    constructor(props){
      super(props);
      this.state = {
          id:'',
          name:'',
          address:'',
          email:'',
          pic:'',
          IsEdit: false,
          file:'',
          password:'',
          errors:'',
      };
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentWillMount(){
        this.mounted = true;
        const Token = localStorage.getItem('token');
        if(Token) {
            axios.get(`${URL_backend}/GetUserData`, {
                headers: {Authorization: Token}
            }).then((res)=>{
                console.log('res', res);
                console.log('res data', res.data.result[0]);
                if(this.mounted){
                    const data = res.data.result[0];
                    this.setState({
                        id: data.id,
                        name: data.name,
                        address: data.address,
                        email: data.email,
                        pic: data.pic
                    })
                } 
            })
        }
    }

    Pic = () =>{
        if(this.state.pic === 'undefined' || this.state.pic === undefined ||
        this.state.pic === null || this.state.pic === ''){
            return false
        } else {
            return true
        }
    }

    EditUserData = ()=>{
        this.setStatef({IsEdit:true})
    }

    // edit start here
    onChange = (e) => {this.setState({[e.target.name]: e.target.value})}

    __handleimageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onload = () =>{
            this.setState({
                file:file,
                pic:reader.result
            })
        }
        reader.readAsDataURL(file)
    }

    SaveUserData = (e) => {
        console.log('save');
        this.setState({ [e.target.name]: e.target.value });
        this.setState({
          IsEdit: false
        });
        console.log(this.state)
  
         
        const file = this.state.file;
        const postData = new FormData();
        postData.append("name", this.state.name);
        postData.append('address',this.state.address);
        postData.append('pic',this.state.pic);
        postData.append('image',file);
  
        console.log('ourdata',postData)

        // http request
        axios.put(`${URL_backend}/edit/${this.state.id}`,postData)
        .then(res => {
          console.log(res);
        })
        .catch((err) => {console.log(err)} )
      
    }
    // edit end here

    // delete user
    handleOnClickRemove = () => {
        confirmComplex({ password: "Enter Your Password To Complete The Operation" }).then(
          ({  input }) => {
            this.setState({
              password:input
            });
            this.RequestToRemove();
          },
          () => {
            this.setState({
              password: `canceled!`
            });
          }
        );
    }

    RequestToRemove = () => {
        // console.log('message' , this.state.message);
        // console.log('prifileprop' , this.props);
         const Pass = this.state.password;
         axios.delete(`${URL_backend}/delete/${this.state.id}/${Pass}`)
          .then(res => {
            console.log(res);
            
            console.log(res.data.message);
            this.props.Logout();
         })
         .catch((err) => {this.setWorngpassword(err)} )
        }
      
        setWorngpassword =(err) => {
          console.log(err); 
          this.setState({erros:'incorrect password please try again'})
    }
    // end of  delete User
      

    

    render(){
      return(
        <> 
        <center>
        <section className="Specific">
        <div className="main" id="main">
            <div className="container">
            <div className="row">
            <div className="col-lg-12 col-md-12">
                {this.state.IsEdit ?
                // edit user data
                <div className="SUsersData">
                     <button className="edit btn btn-danger">
                      <i className="fas fa-edit"></i> Edit</button>
                      <h4><i className="bl">Your Profile Data</i></h4>
                      { this.Pic() ? 
                        <img src={this.state.pic} alt='' />  : 
                        <img src="https://university.cpanel.net/assets/img/user-profile-picture-default.png" alt=""/>            
                      }
                      <div className='clear'></div>
                      <div >                   
                      <label 
                       htmlFor="file-upload" 
                       className="custom-file-upload"> Upload </label>
                      <input id="file-upload" 
                      type="file" 
                      onChange={this.__handleimageChange} />
                      </div>                 
                        
                      <input 
                        type="text" 
                        name="name"
                        className="form-control m-2" 
                        placeholder="name"
                        value={this.state.name ? this.state.name :''}
                        onChange={this.onChange}
                      />
                      <input 
                        type="text" 
                        name="email"
                        className="form-control m-2 bl" 
                        placeholder="email"
                        value={this.state.email}
                        onChange={this.onChange}
                        disabled
                      />
                      <input 
                        type="text" 
                        name="address"
                        className="form-control m-2 " 
                        placeholder="address"
                        value={this.state.address   ? this.state.address :''}
                        onChange={this.onChange}
                      />
                     
                    <button onClick={ this.SaveUserData }
                      className='edit btn btn-primary'>
                      <i  className='fas fa-edit'></i> Save
                    </button>
  
                   </div>
                     
                    // end of  Edit user data
                :
                // show user data
                <div className="SUsersData">
                <button onClick={this.EditUserData} className="edit btn btn-danger">
                <i className="fas fa-edit"></i> Edit</button>
                <h4><i className="bl">Your Profile Data</i></h4>
                {this.Pic() ?
                <img src={this.state.pic} alt='' /> :
                <img src="https://university.cpanel.net/assets/img/user-profile-picture-default.png" alt="" />
                }
                <h4>Name  :<i className="bl"> {this.state.name ? this.state.name : ''} </i>  </h4> 
                <h4>Email  :<i className="bl">{this.state.email}</i> </h4>
                <h4>Address  :<i className="bl"> {this.state.address ? this.state.address : ''} </i> </h4>
                </div>
            }
            {/* Remvoe user  */}
            <div className="REMOVEU" >
                  <button 
                    className='btn btn-danger m-2' 
                    onClick={this.handleOnClickRemove}>Delete Your Account</button>
            </div>
            {/* end of Remvoe user  */}

                
            </div>
            </div>
            </div>
        </div>
        </section>
        </center>

        </>
      );
    }
}
  
export default Profile;
  