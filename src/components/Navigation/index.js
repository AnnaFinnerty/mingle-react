import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import SignOutButton from '../SignOut';

const Navigation = ({ authUser }) => (
  <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
);
const NavigationAuth = () => (
  <header>
    <h1>Playlist Battle</h1>
    <nav className="header-links">
      <Link className="header-link" to={ROUTES.HOME}>Home</Link>
      <Link className="header-link" to={ROUTES.ACCOUNT}>Account</Link>
      <SignOutButton/>
    </nav>
  </header>
);
const NavigationNonAuth = () => (
  <header>
    <h1>Playlist Battle</h1>
    <nav className="header-links">
      <Link className="header-link" to={ROUTES.SIGN_UP}>Sign Up</Link>
      <Link className="header-link" to={ROUTES.SIGN_IN}>Sign In</Link>
      <Link className="header-link" to={ROUTES.SIGN_IN_TEMP}>I've got an invite</Link>
    </nav>
  </header>
);

export default Navigation;
