import React, {Component} from 'react';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withRouter, useParams } from 'react-router-dom';

import '../../App.css';
import { Container, Form, Button, Label, Input } from 'semantic-ui-react'


const AddPlaylistPage = (props) => {
  console.log('playlist props', props)
  return(
    <div>
    <FirebaseContext.Consumer>
      {firebase => <AddPlaylist firebase={firebase} userProps={props.userProps} callback={props.callback} />}
    </FirebaseContext.Consumer>
  </div>
  )
};

class AddPlaylistBase extends Component {
  constructor(props) {
    super();
    //!TODO update prop names
    this.state = {
      newPlaylistTitle:'',
      newPlaylistMood:'default',
      speedThrough: true,
      endSongOnVoteEnd: false,
      suddenDeath: false,
      secondChance: true,
      voteDelay: false,
      voteDelayLength: 30,
    }
    //TODO change to default moods, let users add one
    this.moods = ['party','chill','dance','default']
  }
  createPlaylist = () => {
    console.log("creating playlist");
    console.log(this.props);
    const date = new Date();
    const activateCallback = this.props.callback;
    console.log(activateCallback);
    const title = this.state.newPlaylistTitle;
    this.props.firebase.db.collection("playlists").add({
          active: true,
          title: title,
          mood: this.state.newPlaylistMood,
          userId: this.props.userProps.authUser,
          date: date
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          activateCallback(docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
          // history.push(ROUTES.HOME)
      });
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
            <Label>Create New Playlist</Label>
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

const AddPlaylist = withRouter(AddPlaylistBase)
export default AddPlaylistPage;
export {AddPlaylist};