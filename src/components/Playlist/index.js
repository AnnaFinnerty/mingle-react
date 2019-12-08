import React, {Component} from 'react';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withRouter, useParams } from 'react-router-dom';

import '../../App.css';
import { Container, Form, Button, Label, Input } from 'semantic-ui-react'


const PlaylistPage = () => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <Playlist firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class PlaylistBase extends Component {
  constructor(props) {
    super();
    //!TODO update prop names
    this.state = {
      newPlaylistTitle:'',
      newPlaylistMood:'default',
    }
    //TODO change to default moods, let users add one
    this.moods = ['party','chill','dance','default']
  }
  createPlaylist = () => {
    console.log("creating playlist");
    console.log(this.props);
    const date = new Date();
    const history = this.props.history;
    const activateCallback = this.props.activatePlaylist;
    const title = this.state.newPlaylistTitle;
    this.props.firebase.db.collection("playlists").add({
          active: true,
          title: title,
          mood: this.state.newPlaylistMood,
          userId: this.props.authUser,
          date: date
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          activateCallback(docRef.id);
          history.push(ROUTES.HOME)
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
          history.push(ROUTES.HOME)
      });
  }
  deletePlaylist(e,playlistId){
    console.log('deleting playlist: ' + playlistId);
    const deleteRef = this.props.firebase.db.collection('playlists').doc(playlistId);
    deleteRef.delete()
    .then(()=>{
      console.log(playlistId + " deleted successfully")
    })
    .catch((err) => {
      console.log("error deleting playlist")
    })
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }
  render(){
    return (
        <Container fluid centered="true" style={{width:"100%"}}>
            <Form >
            <Label>New Playlist</Label>
            <Input value={this.state.newPlaylistTitle} 
                name="newPlaylistTitle" 
                placeholder='playlist name'
                onChange={(e)=>this.handleChange(e)}
            />
            <Input value={this.state.newPlaylistMood} 
                name="newPlaylistMood" 
                onChange={this.handleChange}
            />
            <Button onClick={this.createPlaylist}>start</Button>
            </Form>
        </Container>
        
    );
  }
}

const Playlist = withRouter(PlaylistBase)
export default PlaylistPage;
export {Playlist};