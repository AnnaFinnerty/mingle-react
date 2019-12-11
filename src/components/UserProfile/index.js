import React, { Component } from 'react';
import { FirebaseContext } from '../Firebase';
import { Input, Button, Label } from 'semantic-ui-react'

const UserPage = (props) => (
  <div>
    <h2>User Profile</h2>
    <FirebaseContext.Consumer>
      {firebase => <UserProfile {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);


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
  changePassword = event => {
    event.preventDefault();
    console.log('updating password', this.state);
    // const { passwordOne } = this.state;
      this.props.firebase
        .doPasswordUpdate(this.state.password1)
        .then(() => {
          this.setState({ 
            email: this.props.email,
            password1: '',
            password2: '',
            defaultSecretName: '',
            defaultRealName: '',
            totalGames: 0,
            edit: false,
          });
        })
        .catch(error => {
          this.setState({ error });
        });
      event.preventDefault();
  };
  deleteUser = () => {
    console.log('deleting user');
    const user = this.props.firebase.auth.currentUser;
    console.log(user);
    user.delete().then(function(userId) {
      console.log('successfully deleted ' + userId)
    }).catch(function(error) {
      console.log(console.log('error deleting user'))
    });
  }
  onChange = event => {
    console.log("changing text");
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';
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
            <br></br>
            <Label>Change Password</Label>
            <br></br>
            <Input
              name="password1"
              value={passwordOne}
              onChange={this.onChange}
              type="text"
              placeholder="password"
            />
            <br></br>
            <Input
              name="password2"
              value={passwordTwo}
              onChange={this.onChange}
              type="text"
              placeholder="password"
            />
            <br></br>
            <Button color="orange" disabled={isInvalid} onClick={this.changePassword}>
              Update Info
            </Button>
            <br></br>
            <Button color="orange" onClick={this.deleteUser}>
              Delete User
            </Button>
            <br></br>
            {error && <p>{error.message}</p>}
      </div>
    );
  }
}
export default UserPage;
export { UserProfile };