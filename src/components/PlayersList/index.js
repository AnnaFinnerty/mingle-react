import React, {Component} from 'react';
import * as ROUTES from '../../constants/routes';
import { withRouter, useParams } from 'react-router-dom';

import { FirebaseContext } from '../Firebase';

import ModalWindow from '../Modal';
import Message from '../Message';

import '../../App.css';
import { Feed, Grid, Label, Icon} from 'semantic-ui-react'


class PlayersList extends Component {
  constructor(props) {
    super(props);
    console.log('playerslist Props are:', props)
    this.state = {
      players: [],
      reduceApiCalls: props.reduceApiCalls,
    }
  }
  componentDidMount(){
    console.log('players list did mount', this.state);
    //retrieve and populate users and playlists for this creator
    this.getUsers(this.state.activePlaylistId);
    if(!this.state.reduceApiCalls){
        this.getUsers(this.state.activePlaylistId);
    }
  }
  getUsers = () => {
    const playlistId = this.props.playlistId;
    console.log('getting users for playlist:' + playlistId);
    const itemsRef = this.props.firebase.db.collection('temp_users');
    const query = itemsRef.where('playlistId', '==', playlistId).get().then((snapshot) => {
      console.log('getUsers snapshot',snapshot)
      let newUsers = [];
      snapshot.forEach((i) => {
        const item = i.data()
        const id = i.id;
        newUsers.push({
          playlistId: item.playlistId,
          username: item.username,
          secretname: item.secretname,
          songId: item.songId,
          downvotes: item.downvotes,
          upvotes: item.upvotes,
          id: id,
        });
      });
      console.log('users',newUsers);
      this.setState({
        players: newUsers
      });
    });
  }
  deleteUser = (userId) => {
    console.log('deleting user: ' + userId);
    const deleteRef = this.props.firebase.db.collection('temp_users').doc(userId);
    deleteRef.delete()
    .then(()=>{
        console.log("temp user"+ userId + " deleted successfully")
        this.setState({players: this.state.players.filter((player) => (player.id != userId))})
    })
    .catch((err) => {
        console.log("error deleting song")
    })
  }
  render(){
    const users = !this.state.players.length ?
    <Label>no users</Label> :
    this.state.players.map((user)=>{
        return(
          <Feed.Event key={user.id} style={{backgroundColor:"lightgray", padding:"2% 5%", margin:"0 5%", width:"90%"}}>
            <Feed.Label>
              {user.secretname}
              <Icon name="delete" onClick={()=>this.deleteUser(user.id)}></Icon>
            </Feed.Label>
          </Feed.Event>
        )
      })
    return (
   
        <Grid columns={1} fluid={'true'} centered style={{textAlign:"centered"}}>
           <Grid.Column>
                {users}      
           </Grid.Column>
        </Grid>
       
    );
  }
}


export default PlayersList;
