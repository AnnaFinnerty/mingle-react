import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FirebaseContext, withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { Grid, Input, Button } from 'semantic-ui-react';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <FirebaseContext.Consumer>
      {firebase => <SignUpForm firebase={firebase} />}
    </FirebaseContext.Consumer>
  </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
  };

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    event.preventDefault();
    const { username, email, passwordOne } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        console.log('user created successfully');
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const {
        username,
        email,
        passwordOne,
        passwordTwo,
        error,
      } = this.state;
      const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';
    return (
      <Grid centered fluid textAlign='center'>
      <Grid.Row>
        <Grid.Column width={4}>
        </Grid.Column>
        <Grid.Column width={8} >
          <form onSubmit={this.onSubmit}>
            <Input
            name="username"
            value={username}
            onChange={this.onChange}
            type="text"
            placeholder="username"
          />
          <Input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="email"
          />
          <Input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="password"
          />
          <Input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="confirm password"
          />
          <Button color="orange" style={{margin: "0 auto"}} disabled={isInvalid} type="submit">
            Sign Up
          </Button>
          {error && <p>{error.message}</p>}
        </form>
        </Grid.Column>
        <Grid.Column width={4}>
        </Grid.Column>
      </Grid.Row>
  </Grid>
    );
  }
}
const SignUpLink = () => (
  <Button style={{margin: "0 auto"}} color="aqua">
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </Button>
);

const SignUpForm = withRouter(SignUpFormBase);
export default SignUpPage;
export { SignUpForm, SignUpLink };