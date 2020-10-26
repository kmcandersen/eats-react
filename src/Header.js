import React, { Fragment } from 'react';
import './Header.css';
import logo from './img/eats-logo.png';

const Header = () => {
  return (
    <header className="Header--bar">
      <Fragment>
        <div className="Header--logo">
          <img src={logo} title="Eats by the 'L'" />
        </div>
        <div className="Header--tagline">
          Discover great restaurants near CTA rail stations
        </div>
      </Fragment>
    </header>
  );
};

export default Header;
