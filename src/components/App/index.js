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
import UserProfile from '../UserProfile';
import NewSongPage from '../NewSong';
import Playlist from '../AddPlaylist';
import ActivePlaylist from '../ActivePlaylist';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
// import { AuthUserContext } from '../Session';

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
  }
  componentDidMount() {
    // DO NOT DELETE -- UNCOMMENT BEFORE DEPLOY
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        authUser
          ? this.setState({ authUser: authUser.uid })
          : this.setState({ authUser: null });
      },
    );
  }
  componentWillUnmount() {
    this.listener();
  }
  render(){
    console.log('app mounted. auth user:' + this.state.authUser)
    return(
      // <AuthUserContext.Provider value={this.state.authUser}>
        <Router>
          <Navigation authUser={this.state.authUser}/>
          <hr />
          <Switch> 
            <Route exact path={ROUTES.LANDING} component={SignInPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            {/* <Route path={ROUTES.SIGN_IN} component={SignInPage} /> */}
            <Route exact path={ROUTES.SIGN_IN} render={
              (props) => <SignInPage {...props} authUser={this.state.authUser} someProp={'test'}/>
            }/>
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            {/* <Route exact path={ROUTES.HOME} component={HomePage}/> */}
            <Route exact path={ROUTES.HOME} render={
              (props) => <HomePage {...props} authUser={this.state.authUser} someProp={'test'}/>
            }/>
            <Route path={ROUTES.ACCOUNT} component={UserProfile} />
            {/* <Route path={ROUTES.ADMIN} component={AdminPage} /> */}
            {/* <Route path={ROUTES.NEWSONG} component={NewSongPage} /> */}
            {/* <Route path={ROUTES.PLAYLIST} component={Playlist} /> */}
            <Route exact path={ROUTES.SIGN_IN_TEMP} children={SignInTempPage}/>
            <Route exact path={ROUTES.ACTIVEPLAYLIST} children={ActivePlaylist}/>
            <Route exact path={ROUTES.PLAYLIST} children={ActivePlaylist}/>
            {/*Does not work! 
              <Route exact path={ROUTES.ACTIVEPLAYLIST} render={
              (props) => <ActivePlaylist {...props} />
            }/> */}
          </Switch>

        </Router>
      // </AuthUserContext.Provider>
    )
  }
};
export default withFirebase(App);
