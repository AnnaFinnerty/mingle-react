import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import SignInTempPage from '../SignInTemp';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import NewSongPage from '../NewSong';
import Playlist from '../Playlist';
import ActivePlaylist from '../ActivePlaylist';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
  }
  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      },
    );
  }
  componentWillUnmount() {
    this.listener();
  }
  render(){
    return(
      <Router>
        <Navigation authUser={this.state.authUser}/>
        <hr />
        <Switch>
          
          <Route exact path={ROUTES.LANDING} component={SignInPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route path={ROUTES.NEWSONG} component={NewSongPage} />
          <Route path={ROUTES.PLAYLIST} component={Playlist} />
          <Route exact path={ROUTES.SIGN_IN_TEMP} children={SignInTempPage}/>
          <Route path={ROUTES.ACTIVEPLAYLIST} component={ActivePlaylist} />
        </Switch>
      </Router>
    )
  }
};
export default withFirebase(App);
