import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Feed, Input, Button, Label } from 'semantic-ui-react'

const UserPage = (props) => (
  <div>
    <h2>User Profile</h2>
    <FirebaseContext.Consumer>
      {firebase => <UserProfile {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

//come up with user profile info
class UserProfile extends Component {
  constructor(props) {
    super(props);
    console.log('new song form props', props)
    this.state = { 
       email: props.email,
       password1: '',
       password2: '',
       defaultSecretName: '',
       defaultRealName: '',
       totalGames: 0,
       edit: false,
    };
  }
  onSubmit = event => {
    event.preventDefault();
    console.log('submitting new song', this.state);
    const { passwordOne } = this.state;
      this.props.firebase
        .doPasswordUpdate(passwordOne)
        .then(() => {
          // this.setState({ ...INITIAL_STATE });
        })
        .catch(error => {
          this.setState({ error });
        });
      event.preventDefault();
  };
  deleteUser = () => {
    console.log('deleting user');
    const user = this.props.firebase.auth().currentUser;
  }
  onChange = event => {
    console.log("changing text");
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const {
        email,
        password,
        defaultSecretName,
        defaultRealName,
        error,
      } = this.state;
      const isInvalid =
      email === '' ||
      password === ''   ||
      defaultSecretName === '' ||
      defaultRealName === '';
    return (
     <div style={{textAlign:'center'}}>
       <h3>Account</h3>
            <Input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="email"
            />
            <Label>Change Password</Label>
            <Input
              name="password1"
              value={password}
              onChange={this.onChange}
              type="text"
              placeholder="password"
            />
            <Input
              name="password2"
              value={password}
              onChange={this.onChange}
              type="text"
              placeholder="password"
            />
            <Button color="orange" disabled={isInvalid} type="submit">
              Update Info
            </Button>
            {error && <p>{error.message}</p>}
      </div>
    );
  }
}
export default UserPage;
export { UserProfile };