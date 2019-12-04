import React, {Component} from 'react';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withRouter } from 'react-router-dom';

import '../../App.css';
import { Modal, Form, Grid, Button, Label, Input, Feed, Header } from 'semantic-ui-react'


const HomePage = () => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <Home firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

class HomeBase extends Component {
  constructor() {
    super();
    this.state = {
      activePlaylist: 'test',
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
  addPlaylist = () => {
    console.log('adding playlist');
    console.log(this.props);
    this.props.history.push(ROUTES.NEWSONG)
  }
  render(){
    const playlists = !this.state.playlists.length ?
    <Label>no playlists</Label> :
    this.state.playlists.map((playlist)=>{
      console.log(playlist);
      return(
        <Feed.Event style={{backgroundColor:"lightgray", padding:"2% 5%", margin:"0 5%", width:"90%"}}>
          <Feed.Label>
            {playlist.title}
          </Feed.Label>
        </Feed.Event>
      )
    })
    return (
      <React.Fragment>
        <Grid columns={2} divided>
          <Grid.Row fluid centered>
            {
                this.state.activePlaylist ? 
                <Button onClick={this.addPlaylist}>Full Playlist</Button>
                :
                <Button onClick={this.createPlaylist}>create playlist to start</Button>
            }
          </Grid.Row>
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
              <Feed>
                {playlists}
              </Feed>
            </Grid.Column>
            <Grid.Column>
              <h3>Invites Sent</h3>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal >
          <Modal.Header>Select a Photo</Modal.Header>
          <Modal.Content image>
            
          </Modal.Content>
        </Modal>
      </React.Fragment>
    );
  }
}

const Home = withRouter(HomeBase)
export default HomePage;
export {Home};