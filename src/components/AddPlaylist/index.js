import React, {Component} from 'react';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withRouter, useParams } from 'react-router-dom';

import '../../App.css';
import { Grid, Container, Form, Dropdown, Button, Radio, Label, Input } from 'semantic-ui-react'


const AddPlaylistPage = (props) => {
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
      displayName: '',
      secretName: '',
      speedThrough: true,
      endSongOnVoteEnd: false,
      suddenDeath: false,
      secondChance: true,
      voteDelay: false,
      voteDelayLength: 30,
    }
    //TODO change to default moods, let users add one
    this.moods = ['party','chill','dance','default']
    this.randomNamesPart1 = ['Aqua', 'Evil', 'Super', 'Magenta', 'Cool', 'Happy']
    this.randomNamesPart2 = ['Badger', 'Fox', 'Giraffe', 'Aardvark', 'Corgi', 'Bunny']
  }
  createPlaylist = () => {
    const db = this.props.firebase.db;
    const date = new Date();
    const activateCallback = this.props.callback;
    const title = this.state.newPlaylistTitle;
    const displayName = this.state.displayName;
    const secretName = this.state.secretName;
    db.collection("playlists").add({
          active: true,
          title: title,
          mood: this.state.newPlaylistMood,
          speedThrough: this.state.speedThrough,
          endSongOnVoteEnd: this.state.endSongOnVoteEnd,
          suddenDeath: this.state.suddenDeath,
          secondChance: this.state.secondChance,
          voteDelay: this.state.voteDelay,
          voteDelayLength: this.state.voteDelayLength,
          userId: this.props.userProps.authUser,
          date: date
      })
      .then(function(playlistRef) {
          console.log("Playlist created with ID: ", playlistRef.id);
          //create temporary user profile for creator
          db.collection("temp_users").add({
            username: displayName,
            secretname: secretName,
            playlistId: playlistRef.id,
            upvotes: 0,
            downvotes: 0,
            songId: '',
            authUser: true,
          })
          .then((userRef) => {
              console.log("Temporary user created with ID: ", userRef.id);
              activateCallback(playlistRef.id, userRef.id, displayName, secretName);
          })
          .catch(function(error) {
              console.error("Error adding temporary user ", error);
          });
      })
      .catch(function(error) {
          console.error("Error adding playlist ", error);
      });
  }
  randomNameGen = (e) => {
    e.preventDefault();
    function randomFromArray(arr){
      return arr[Math.floor(Math.random()*arr.length)]
    }
    const name1 = randomFromArray(this.randomNamesPart1);
    const name2 = randomFromArray(this.randomNamesPart2);
    this.setState({
      secretName:name1+name2
    })
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }
  handleDropdownChange = (e, data) => {
    this.setState({
      [e.target.name]: data.value
    })
  }
  onRadioChange = (e, data) => {
    this.setState({
        [data.name] : data.checked
    })
  }
  render(){
    const moodOptions = this.moods.map((mood,i)=>{
      return(
          {
              text: mood,
              value: mood,
              key: mood + "_" + i
          }
      )
    })
    return (
        <Container fluid centered="true" style={{width:"100%"}}>
            <Form >
              <Label>Create New Playlist</Label>
              <Input value={this.state.newPlaylistTitle} 
                  name="newPlaylistTitle" 
                  placeholder='playlist name'
                  onChange={(e)=>this.handleChange(e)}
              />
              <Dropdown
                  placeholder='Select Mood'
                  renderLabel={({ v }) => 1}
                  search
                  fluid
                  selection
                  options={moodOptions}
                  onChange={this.handleDropdownChange}
              />
              {
                !this.props.gameMode ? "":
              <Grid columns={2} centered divided>
                <Label>game options</Label>
                <Grid.Column>
                    <Grid.Row>
                        <Label>Speed Through Mode</Label>
                        {
                            this.state.speedThrough ? 
                            <Radio toggle checked name="speedThrough" onChange={this.onRadioChange}/>
                            :
                            <Radio toggle name="speedThrough" onChange={this.onRadioChange}/>
                        }
                    </Grid.Row>
                    <Grid.Row>
                        <Label>Remove Sownvoted Songs</Label>
                        {
                            this.state.endSongOnVoteEnd ? 
                            <Radio toggle checked name="endSongOnVoteEnd" onChange={this.onRadioChange}/>
                            :
                            <Radio toggle name="endSongOnVoteEnd" onChange={this.onRadioChange}/>
                        }
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column>
                  <Grid.Row>
                          <Label>Sudden Death</Label>
                          {
                              this.state.suddenDeath ? 
                              <Radio toggle checked name="suddenDeath" onChange={this.onRadioChange}/>
                              :
                              <Radio toggle name="suddenDeath" onChange={this.onRadioChange}/>                        
                          }
                      </Grid.Row>
                      <Grid.Row>
                          <Label>Second Chance</Label>
                          {
                              this.state.secondChance ? 
                              <Radio toggle checked name="secondChance" onChange={this.onRadioChange}/>
                              :
                              <Radio toggle name="secondChance" onChange={this.onRadioChange}/>                        
                          }
                      </Grid.Row>
                </Grid.Column>
              </Grid>
              }
              {
                !this.props.gameMode ? "" :
              <React.Fragment>
              <Label>a secret name to hide your identity</Label>
              <Input
                  name="secretName"
                  value={this.state.secretName}
                  onChange={(e)=>this.handleChange(e)}
                  type="text"
                  placeholder="secret name"
              />
              <Button onClick={this.randomNameGen}>random</Button>
              <Label>a name people will recognize later</Label>
              <Input
                  name="displayName"
                  value={this.state.displayName}
                  onChange={(e)=>this.handleChange(e)}
                  type="text"
                  placeholder="display name"
              />
              </React.Fragment>
              }
              <Button color="orange" onClick={this.createPlaylist}>create playlist</Button>
            </Form>
        </Container>
        
    );
  }
}

const AddPlaylist = withRouter(AddPlaylistBase)
export default AddPlaylistPage;
export {AddPlaylist};