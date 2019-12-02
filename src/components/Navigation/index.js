import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
const Navigation = () => (
  <div className="header-links">
    <span className="header-link"></span>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    <span className="header-link"></span>  
        <Link to={ROUTES.LANDING}>Landing</Link>
    <span className="header-link"></span>
        <Link to={ROUTES.HOME}>Home</Link>
    <span className="header-link"></span>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
    <span className="header-link"></span>
        <Link to={ROUTES.NEWSONG}>Add Song</Link>
  </div>
);
export default Navigation;