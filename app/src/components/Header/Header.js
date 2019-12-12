import React, { Component } from 'react';
import SVG from 'react-inlinesvg';

import './Header.scss';

import imgLogo from '../../assets/logo.svg';

import iconSearch from '../../assets/icons/search.svg';
import iconAccount from '../../assets/icons/account.svg';

export default class Header extends Component
{
  render()
  {
    return (<header className="app-header">
      <div className="app-header__logo">
        <SVG src={imgLogo} />
      </div>
      <button className="app-header__search">
        <SVG src={iconSearch} />
      </button>
      <button className="app-header__account">
        <SVG src={iconAccount} />
      </button>
    </header>);
  }
}
