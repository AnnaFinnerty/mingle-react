import React, {Component} from 'react';

import '../../App.css';
import { Feed, Grid, Label, Icon, Loader} from 'semantic-ui-react'


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
        <div key={user.id} className="list-item">
          <Feed.Event className="list-item">
            <Feed.Label>
              {user.secretname}
              <Icon name="delete" className="delete-hover" onClick={()=>this.deleteUser(user.id)}></Icon>
            </Feed.Label>
          </Feed.Event>
        </div>
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
