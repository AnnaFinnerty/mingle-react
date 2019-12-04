import React, {Component} from 'react';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withRouter } from 'react-router-dom';

import '../../App.css';
import { Modal, Form, Grid, Button, Label, Input, Feed, Header } from 'semantic-ui-react'


const PlaylistPage = () => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <PlaylistBase firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class PlaylistBase extends Component {
  constructor() {
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
    console.log('title',this.state.newPlaylistTitle);
    console.log('mood',this.state.newPlaylistMood);
    const date = new Date();
    this.props.firebase.db.collection("playlists").add({
      title: this.state.newPlaylistTitle,
      mood: this.state.newPlaylistMood,
      userId: 1,
      date: date
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          this.props.history.push(ROUTES.HOME)
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
          this.props.history.push(ROUTES.HOME)
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
    this.setState({songs: this.state.playlistId.filter((playlist) => (playlist.id != playlistId))})
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }
  addPlaylist = () => {
    console.log('adding playlist');
    console.log(this.props);
    
  }
  render(){
    return (
        <Form>
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
    );
  }
}

const Playlist = withRouter(PlaylistBase)
export default PlaylistPage;
export {Playlist};