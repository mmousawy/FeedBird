import React, { Component } from 'react';
import SVG from 'react-inlinesvg';

import './NavBar.scss';

import iconRead from '../../assets/icons/read.svg';
import iconExplore from '../../assets/icons/explore.svg';
import iconManage from '../../assets/icons/manage.svg';

export default class NavBar extends Component
{
  render()
  {
    return (<nav className="app-navigation">
      <ul>
        <li>
          <SVG src={iconRead} />
          <span>Read</span>
        </li>
        <li>
          <SVG src={iconExplore} />
          <span>Explore</span>
        </li>
        <li>
          <SVG src={iconManage} />
          <span>Manage</span>
        </li>
      </ul>
    </nav>);
  }
}
