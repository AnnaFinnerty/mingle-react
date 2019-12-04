import React, {Component} from 'react';
import firebase from '../Firebase';
import { FirebaseContext } from '../Firebase';
import '../../App.css';
import { Form, Grid, Button, Label, Input } from 'semantic-ui-react'
import { tsMethodSignature } from '@babel/types';

const HomePage = () => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <Home firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class Home extends Component {
  constructor() {
    super();
    this.state = {
      playlists: [],
      newPlaylistTitle:'',
      newPlaylistMood:'default',
    }
    this.moods = ['party','chill','dance','default']
  }
  componentDidMount(){
    this.getPlaylists();
  }
  getPlaylists() {
    const itemsRef = this.props.firebase.db.collection('playlists');
    itemsRef.get().then((snapshot) => {
      //let items = snapshot.val();
      console.log('snapshot',snapshot)
      let newItems = [];
      snapshot.forEach((i) => {
        const item = i.data()
        const id = i.id;
        newItems.push({
          date: item.date,
          userId: item.userId,
          title: item.title,
          mood: item.mood,
          id: id,
        });
      });
      this.setState({
        playlists: newItems
      });
    });
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
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
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
  render(){
    const playlists = !this.state.playlists.length ?
    <Label>no playlists</Label> :
    this.state.playlists.map((playlist)=>{
      console.log(playlist);
      return(
        <div>playlist</div>
      )
    })
    return (
      <React.Fragment>
        <h2>Home</h2>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <h3>Playlists</h3>
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
                <Button onClick={this.createPlaylist}>+</Button>
              </Form>
              {playlists}
            </Grid.Column>
            <Grid.Column>
              <h3>Invites Sent</h3>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default HomePage;
export {Home};