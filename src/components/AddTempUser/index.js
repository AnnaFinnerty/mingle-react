import React, { Component } from 'react';
import { Link, withRouter, useParams } from 'react-router-dom';
import { FirebaseContext, withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { Label, Button } from 'semantic-ui-react';
import { SignUpLink } from '../SignUp';

const AddTempUserWrapper = (props) => (
  <div>
    <FirebaseContext.Consumer>
      {firebase => <AddTempUserFormBase firebase={firebase} playlistId={props.playlistId} authUser={props.authUser} history={props.history}/>}
    </FirebaseContext.Consumer>
  </div>
);

const INITIAL_STATE = {
    username: '',
    secretname: '',
    playlistId: '',
    showManualPlaylistEntry: false,
  };

class AddTempUserFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.randomNamesPart1 = ['Aqua', 'Evil', 'Super', 'Magenta', 'Cool', 'Happy']
    this.randomNamesPart2 = ['Badger', 'Fox', 'Giraffe', 'Aardvark', 'Corgi', 'Bunny']
  }
  componentDidMount = () => {
    console.log('signInTemp did mount', this.props)
    //this is what needs to be loaded!
    // const playlistId = this.props.match.params.playlistId;
    const playlistId = this.props.playlistId;
    if(!playlistId){
      console.log("no playlist found, show manual entry:  " +  playlistId);
      this.setState({
        showManualPlaylistEntry: true,
      })
    } else {
        console.log("found playlistId:  " +  playlistId);
        this.setState({
            playlistId: playlistId
          })
    }
  }
  onSubmit = event => {
    console.log('submitting temp user');
    console.log(this.props);
    event.preventDefault();
    const { username, secretname , playlistId} = this.state;
    this.props.firebase.db.collection("temp_users").add({
      username: username,
      secretname: secretname,
      playlistId: playlistId,
      upvotes: 0,
      downvotes: 0,
      songId: '',
      })
      .then((userRef) => {
          console.log("Document written with ID: ", userRef.id);
          this.props.history.push('/activeplaylist/'+userRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
      };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  randomNameGen = (e) => {
    e.preventDefault();
    function randomFromArray(arr){
      return arr[Math.floor(Math.random()*arr.length)]
    }
    const name1 = randomFromArray(this.randomNamesPart1);
    const name2 = randomFromArray(this.randomNamesPart2);
    this.setState({
      secretname:name1+name2
    })
  }
  render() {
    // console.log("addTempUserProps",this.props);
    const {
        username,
        secretname,
        error
      } = this.state;
      const isInvalid =
      username === '' ||
      secretname === '';
    return (
      <form onSubmit={this.onSubmit}>
          <Label>a secret name to hide your identity</Label>
          <Button onClick={this.randomNameGen}>just give me a random name</Button>
          <input
            name="secretname"
            value={secretname}
            onChange={this.onChange}
            type="text"
            placeholder="secret name"
          />
          <Label>a name people will recognize later</Label>
          <input
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="username"
          />
          <button type="submit" disabled={isInvalid} 
                  >
            let's go!
          </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const AddTempUserForm = withRouter(AddTempUserFormBase);
export default AddTempUserWrapper;
export { AddTempUserForm, SignUpLink };