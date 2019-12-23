import React, { Component } from 'react';
import { ApiContext } from '../../state/ApiContext';

import './Header.scss';

import { ReactComponent as ImgLogo } from '../../assets/logo.svg';
import { ReactComponent as IconSearch } from '../../assets/icons/search.svg';
import { ReactComponent as IconAccount } from '../../assets/icons/account.svg';

export default class Header extends Component
{
  static contextType = ApiContext;

  render()
  {
    return (<header className="app-header">
      <div className="app-header__logo">
        <ImgLogo />
      </div>
      <button className="app-header__search">
        <IconSearch />
      </button>
      <button className="app-header__account">
        <IconAccount />
      </button>
    </header>);
  }
}
