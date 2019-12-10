import React, {Component} from 'react';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withRouter, useParams } from 'react-router-dom';

import '../../App.css';
import { Container, Form, Button, Label, Input } from 'semantic-ui-react'


const EditPlaylistPage = (props) => {
  console.log('playlist props', props)
  return(
    <div>
    <FirebaseContext.Consumer>
      {firebase => <EditPlaylist {...props} firebase={firebase}/>}
    </FirebaseContext.Consumer>
  </div>
  )
};

class EditPlaylistBase extends Component {
  constructor(props) {
    super();
    //!TODO update prop names
    this.state = {
      userId: props.userProps.playlistToEdit.userId,
      title:props.userProps.playlistToEdit.title,
      mood:props.userProps.playlistToEdit.mood,
      date: props.userProps.playlistToEdit.date,
      active: props.userProps.playlistToEdit.active,
      id: props.userProps.playlistToEdit.id
    }
    //TODO change to default moods, let users add one
    this.moods = ['party','chill','dance','default']
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
            <Button onClick={()=>this.props.updatePlaylist(this.state)}>update</Button>
            </Form>
        </Container>
        
    );
  }
}

const EditPlaylist = withRouter(EditPlaylistBase)
export default EditPlaylistPage;
export {EditPlaylist};