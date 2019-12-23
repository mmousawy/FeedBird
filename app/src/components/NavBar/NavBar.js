import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './NavBar.scss';

import { ReactComponent as IconRead } from '../../assets/icons/read.svg';
import { ReactComponent as IconExplore } from '../../assets/icons/explore.svg';
import { ReactComponent as IconManage } from '../../assets/icons/manage.svg';

export default class NavBar extends Component
{
  render()
  {
    return (<nav className="app-navigation">
      <ul>
        <li>
          <Link to="/">
            <IconRead />
            <span>Read</span>
          </Link>
        </li>
        <li>
          <Link to="/explore">
            <IconExplore />
            <span>Explore</span>
          </Link>
        </li>
        <li>
          <Link to="/manage">
            <IconManage />
            <span>Manage</span>
          </Link>
        </li>
      </ul>
    </nav>);
  }
}
