import React, { Component } from 'react';
import { Link, withRouter, useParams } from 'react-router-dom';
import { FirebaseContext, withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import AddTempUser from '../AddTempUser';

import { Grid, Button, Label } from 'semantic-ui-react';
import { SignUpLink } from '../SignUp';

const SignInTempPage = () => (
  <div>
    <h1>Pick Game Names</h1>
    <FirebaseContext.Consumer>
      {firebase => <SignInTempForm firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

const INITIAL_STATE = {
    username: '',
    secretname: '',
    showManualPlaylistEntry: false,
    playlistId: null,
  };

class SignInTempFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  render() {
    console.log("signInTempProps",this.props);
    const {
        username,
        secretname,
        error
      } = this.state;
      const isInvalid =
      username === '' ||
      secretname === '';
    let playlistId = null;
    try{
      playlistId = this.props.match.params.playlistId;
    } catch(e){}
    return (
      <Grid fluid textAlign='center'>
        <Grid.Row>
          <Grid.Column width={4}>
          </Grid.Column>
          <Grid.Column width={8}>
          <AddTempUser playlistId={playlistId} authUser={false} history={this.props.history}/>
          <Label color="black" style={{textAlign:"center",color:"white"}}>
            Hey, just so you know, <br></br> 
            you're logging in as a guest user, <br></br>
            so we won't be keeping track of your progress. <br></br>
            To start your own game <br></br> 
            sign up for a real account, stranger <br></br>
            <Button color="orange" style={{margin:"20px"}}>
              <Link to={ROUTES.SIGN_UP} style={{color:"white"}}>Sign Up</Link>
            </Button>
          </Label>
          </Grid.Column>
          <Grid.Column width={4}>
          </Grid.Column>
        </Grid.Row>
    </Grid>
    );
  }
}

const SignInTempForm = withRouter(SignInTempFormBase);
export default SignInTempPage;
export { SignInTempForm, SignUpLink };