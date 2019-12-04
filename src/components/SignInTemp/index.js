import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FirebaseContext, withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInTempPage = () => (
  <div>
    <h1>SignInTemp</h1>
    <FirebaseContext.Consumer>
      {firebase => <SignInTempForm firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

const INITIAL_STATE = {
    username: '',
    secretname: ''
  };

class SignInTempFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    event.preventDefault();
    const { username, secretname } = this.state;
    
    //TODO how to get playlistId into props???
    this.props.firebase.db.collection("users").add({
      username: username,
      secretname: secretname,
      playlistId: this.props.playlistId
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
      };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
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
          <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="username"
        />
        <input
          name="secretname"
          value={secretname}
          onChange={this.onChange}
          type="text"
          placeholder="email"
        />
        <button disabled={isInvalid} type="submit">
          Sign Up
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
const SignUpLink = () => (
  <p>
    Want to control the game? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignInTempForm = withRouter(SignInTempFormBase);
export default SignInTempPage;
export { SignInTempForm, SignUpLink };