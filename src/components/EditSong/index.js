import React, {Component} from 'react';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withRouter, useParams } from 'react-router-dom';

import '../../App.css';
import { Container, Form, Button, Label, Input } from 'semantic-ui-react'


const EditSongPage = (props) => {
  console.log('playlist props', props)
  return(
    <div>
    <FirebaseContext.Consumer>
      {firebase => <EditSongBase firebase={firebase} userProps={props.userProps} />}
    </FirebaseContext.Consumer>
  </div>
  )
};

class EditSongBase extends Component {
  constructor(props) {
    super();
    //!TODO update prop names
    this.state = {
      title:props.userProps.playlistToEdit.title,
      mood:props.userProps.playlistToEdit.mood,
      date: props.userProps.playlistToEdit.date,
      active: props.userProps.playlistToEdit.active
    }
    //TODO change to default moods, let users add one
    this.moods = ['party','chill','dance','default']
  }
  updatePlaylist = () => {
    const playlistId = this.props.userProps.playlistToEdit.id;
    console.log("updating playlist:  " + playlistId);
    console.log(this.props);
    const playlistRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
    playlistRef.update({
          active: this.state.active,
          title: this.state.title,
          mood: this.state.mood,
          userId: this.props.userProps.authUser,
          date: this.state.date
      })
      .then(function(docRef) {
          console.log("document updated");
          // activateCallback(docRef.id);
          // history.push(ROUTES.HOME)
      })
      .catch(function(error) {
          console.error("Error updating document: ", error);
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
            <Label><h3>Edit Playlist:{this.state.title}</h3></Label>
            {/* <h4>Created:{this.state.date}</h4> */}
            <Input value={this.state.title} 
                name="title" 
                placeholder='playlist name'
                onChange={(e)=>this.handleChange(e)}
            />
            <Input value={this.state.mood} 
                name="mood" 
                onChange={this.handleChange}
            />
            <Button onClick={this.updatePlaylist}>start</Button>
            </Form>
        </Container>
        
    );
  }
}

const EditSong = withRouter(EditSongBase)
export default EditSongPage;
export {EditSong};