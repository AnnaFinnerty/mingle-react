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
       password: props.password,
       defaultSecretName: '',
       defaultRealName: '',
       totalGames: 0,
       edit: false,
    };
  }
  onSubmit = event => {
    event.preventDefault();
    console.log('submitting new song', this.state);
    // const { title, url, playlistId, userId } = this.state;
    // console.log('updating user: ' + userId );
    //     const itemRef = this.props.firebase.db.doc(`/playlists/${playlistId}`);
    //     let query = itemRef.get().then(snapshot => {
    //             if (snapshot.empty) {
    //             console.log('No matching documents.');
    //             return;
    //             }  
    //             console.log('get snapshot', snapshot.data())
    //             const data = snapshot.data();
    //             data['id'] = snapshot.id;
    //             this.setState({
    //                 playlistToEdit: data,
    //                 modalOpen: true,
    //                 modalType: 'editPlaylist'
    //             })
    //         })
    //         .catch(err => {
    //             console.log('Error getting documents', err);
    //         });
  };
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
       <h3>Stats</h3>

        <form onSubmit={this.onSubmit}>
            <Input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="email"
            />
            <Input
              name="password"
              value={password}
              onChange={this.onChange}
              type="text"
              placeholder="password"
            />
            <Input
              name="defaultSecretName"
              value={defaultSecretName}
              onChange={this.onChange}
              type="text"
              placeholder="default secret name"
            />
            <Input
              name="defaultRealName"
              value={defaultRealName}
              onChange={this.onChange}
              type="text"
              placeholder="default real name"
            />
            <Button color="orange" disabled={isInvalid} type="submit">
              Update Info
            </Button>
            {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}
export default UserPage;
export { UserProfile };