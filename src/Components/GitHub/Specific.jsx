import React, {Component} from 'react';
import Repose from './Repose';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {AddToFavorite, DeleteFromFav, GETFavoriteState} from '../../Store/Actions';
import Favorite from '../../Store/Reducers/Favorite_reducer';

class Specific extends Component {
    
  constructor(props){
    super(props);
    this.state = { 
        user:[],
        is_Fav: false
     };

     // get state
     this.props.GETFavoriteState();

     const FetchUser = async(user) => {
         const API_Call = await fetch(`http://api.github.com/users/${user}`);
         const data = await API_Call.json();
         return {data}
     }
     // initialize the method
     FetchUser(props.match.params.login).then((res)=>{
         if(!res.data.message){
             this.setState({user: res.data})
         }
     })
  }

  async componentDidMount(){
      console.log('specific', this.props.Favorite.FavoriteData);
      let data = this.props.Favorite.FavoriteData;
      let theUser = this.props.match.params.login;

      for(let index=0; index<data.length; index++){
          const el = data[index];
          if(el === theUser){
              this.setState({is_Fav:true})
          }
      }
  }

  AddToFav = () =>{
      this.props.AddToFavorite(this.state.user.login);
      this.setState({is_Fav:true})
  }

  RemoveFromFav = ()=>{
      this.props.DeleteFromFav(this.state.user.login);
      this.setState({is_Fav:false});
  }

  Data(){
      if(this.state.user.login === 0){
          return(<i>there is no user found with givin user name: 
              {this.props.match.params.login}
          </i>)
      } else {
          return (
            <center>
            <section className="Specific">
              <div className="main" id="main">
              <div className="container">
                <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="SUsersData">
                      {this.state.is_Fav === false ? 
                        <i onClick={this.AddToFav} className="fas fa-heart  NotFave"></i>:
                        <i onClick={this.RemoveFromFav} className="fas fa-heart  Fave"></i> }
   
                  <h4>Name :<i className="bl">{this.state.user.name}</i>   </h4>
                  <img src={this.state.user.avatar_url} alt="" />
                    <h4>followers :<i className="bl"> {this.state.user.followers} </i>  </h4> 
                    <h4>location :<i className="bl"> {this.state.user.location} </i> </h4>
                    <Repose user={this.props.match.params.login} />
                    </div>
                    </div>
                    </div>
                    </div>
                </div>
            </section>
            </center>
          )
      }
  }



 
  render(){
    return(
        <React.Fragment>
            {this.Data()}
        </React.Fragment>
    );
  }
}

Specific.protoTypes = {
    AddToFavorite: PropTypes.func.isRequired,
    DeleteFromFav: PropTypes.func.isRequired,
    GETFavoriteState: PropTypes.func.isRequired,
    Favorite: PropTypes.object.isRequired
}

const mapStateToProps = (state) =>({
    Favorite: state.Favorite
});

export default connect(mapStateToProps,{AddToFavorite,DeleteFromFav,GETFavoriteState}) (Specific);