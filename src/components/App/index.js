import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
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

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
  }
  render(){
    return(
      <Router>
        <div>
          <Navigation authUser={this.state.authUser}/>
          <hr />
          <Route exact path={ROUTES.LANDING} component={SignInPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.SIGN_IN_TEMP} component={SignInTempPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
          <Route path={ROUTES.NEWSONG} component={NewSongPage} />
          <Route path={ROUTES.PLAYLIST} component={Playlist} />
          <Route path={ROUTES.ACTIVEPLAYLIST} component={ActivePlaylist} />
          {/* <Route exact path="/login" render={(props) => <Login {...props} logOut={this.logOut} logIn={this.logIn}/>}/> */}
        </div>
      </Router>
    )
  }
};
export default App;
