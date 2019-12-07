import React from 'react';
import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => {
  const signOut = () => {
    console.log('sign out props');
    firebase.doSignOut();
  }
  return(
    <button className="header-link" type="button" onClick={signOut}>
      Sign Out
    </button>
  )
};

export default withFirebase(SignOutButton);