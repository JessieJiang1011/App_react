import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {AddToFavorite, DeleteFromFav, GETFavoriteState} from '../../Store/Actions';


class Favorite extends Component {
    
  constructor(props){
    super(props);
    this.state = { 
        users:[]
    }
    this.props.GETFavoriteState();
    this.data();
    }
    
    async data(){
        console.log('Store2', this.props);
        let data = await this.props.Favorite.FavoriteData;
        let BigData = [];
        for (let index = 0;index <data.length; index++){
            const user = data[index];
            const fetchUsers = async (user) =>{
                const api_call = await fetch(`http://api.github.com/users/${user}`)
                const data = await api_call.json();
                return {data}
        };
        fetchUsers(user).then((res)=>{
            if(!res.data.message){
                res.data.is_user_in_Fav = true;
                BigData.push(res.data);
                this.setState({users: BigData})
            }
        })

        }
    }

    RemoveFromFav(user) {
        this.props.DeleteFromFav(user);

        let array = this.state.users;
        let newArr = [];
        for(let i = 0; i<array.length; i++){
            const el = array[i];
            if(el.login === user){
                el.is_user_in_Fav = false;
            }
            newArr.push(el);
        }
        this.setState({users: newArr});
    }

    ReAddToFav(user){
        this.props.AddToFavorite(user);
        let array = this.state.users;
        let newArr = [];

        for (let i = 0; i< array.length; i++){
            const el = array[i];
            if(el.login === user){
                el.is_user_in_Fav = true;
            }
            newArr.push(el);
        }
        this.setState({users: newArr})
    }

    GoFetchOneUser(data){
        this.props.history.push({
            pathname:`/Specific/${data}`,
        })
    }

 
  render(){
    return(
        <React.Fragment>
            

        <main role="main">

        <div className="album py-5 bg-light">
        <div className="container">

            <div className="row">

                {this.state.users.map(user =>(
                    <div key={user.id} className="col-md-4">
                    <div key={user.id} className="card mb-4 shadow-sm">
                        <img 
                        className="bd-placeholder-img card-img-top" 
                        width="100%" height="225" 
                        src={user.avatar_url} 
                        alt=''  />
                    <div className="card-body">
                    <p className="card-text text-center">
                    Name : {user.login}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group"></div>
                    <button type="button" 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={()=>{
                        this.GoFetchOneUser(user.login)
                    }}
                    key={user.id}>View</button>
                    </div>
                    {user.is_user_in_Fav ? 
                    <button type="button" 
                    className="btn btn-sm "
                    onClick={()=>{
                        this.RemoveFromFav(user.login)
                    }}>
                        <i class="fas fa-heart Fave"></i>
                    </button> :
                    <button type="button" 
                    className="btn btn-sm "
                    onClick={()=>{
                        this.ReAddToFav(user.login);
                    }} >
                        <i className="fas fa-heart NotFave"></i>
                    </button>
                    }
                    </div>
                    </div>
                    </div>
                ))}
        
            </div>
        </div>
        </div>

        </main>




        </React.Fragment>
    );
  }
}

Favorite.protoTypes = {
    AddToFavorite: PropTypes.func.isRequired,
    DeleteFromFav: PropTypes.func.isRequired,
    GETFavoriteState: PropTypes.func.isRequired,
    Favorite: PropTypes.object.isRequired

}

const mapStateToProps = (state) =>({
    Favorite: state.Favorite
})

export default connect(mapStateToProps, {AddToFavorite,
DeleteFromFav,GETFavoriteState}) (Favorite);