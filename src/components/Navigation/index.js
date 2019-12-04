import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
const Navigation = () => (
  <header>
    <h1>Playlist Battle</h1>
    <nav className="header-links">
    
      <Link className="header-link" to={ROUTES.HOME}>Home</Link>
      <Link className="header-link" to={ROUTES.NEWSONG}>Add Song</Link>
      <Link className="header-link" to={ROUTES.ACCOUNT}>Account</Link>
      <Link className="header-link" to={ROUTES.SIGN_IN}>Sign In</Link>
      <Link className="header-link" to={ROUTES.SIGN_IN_TEMP}>Sign In Temp</Link>
  
    </nav>
  </header>
);
export default Navigation;