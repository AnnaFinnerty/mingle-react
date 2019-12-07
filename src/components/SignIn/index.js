import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { SignUpLink } from '../SignUp';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = (props) => (
  <div>
    <h2>Sign In</h2>

    <FirebaseContext.Consumer>
      {firebase => <SignInForm firebase={firebase} authUser={props.authUser}/>}
    </FirebaseContext.Consumer>
    <SignUpLink />
  </div>
);
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.authUser){
      this.props.history.push('/home');
    }
  }
  onSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
const SignInForm = withRouter(SignInFormBase);
export default SignInPage;
export { SignInForm };