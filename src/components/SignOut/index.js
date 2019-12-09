import React from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

const SignOut = (props) => {
  const signOut = () => {
    console.log('sign out props',props);
    props.firebase.doSignOut();
    props.history.push('/');
  }
  return(
    <button className="header-link" type="button" onClick={signOut}>
      Sign Out
    </button>
  )
};


const SignOutButton = withRouter(SignOut);
export default withFirebase(SignOutButton);