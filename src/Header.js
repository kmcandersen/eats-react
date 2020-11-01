import React, { Fragment } from 'react';
import './Header.css';
import { ReactComponent as Logo } from './img/eats-logo.svg';

const Header = () => {
  return (
    <header className="Header--bar">
      <Fragment>
        <div className="Header--logo">
          <Logo />
        </div>
        <div className="Header--tagline">
          Discover great restaurants near CTA rail stations
        </div>
      </Fragment>
    </header>
  );
};

export default Header;
