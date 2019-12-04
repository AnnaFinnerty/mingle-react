import React, {Component} from 'react';
import firebase from '../Firebase';
import { FirebaseContext } from '../Firebase';
import '../../App.css';
import { Form, Grid, Button, Label, Input } from 'semantic-ui-react'

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
      newPlaylistTitle:'',
      newPlaylistMood:'default',
    }
    this.moods = ['party','chill','dance','default']
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }
  createPlaylist = () => {
    console.log("creating playlist");
    console.log('title',this.state.newPlaylistTitle);
    console.log('mood',this.state.newPlaylistMood);
    this.props.firebase.db.collection("playlists").add({
      title: this.state.newPlaylistTitle,
      mood: this.state.newPlaylistMood
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
  }
  render(){
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