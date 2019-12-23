import React, { Component } from 'react';

import { ReactComponent as IconPostLogo } from '../../assets/icons/hexagon.svg';

import './PostItem.scss';

export default class PostItem extends Component
{
  constructor(props)
  {
    super(props);

    this.state = props.data;
  }

  render()
  {
    return (<article className="post-item">
      <div className="post-item__content">
        <header className="post-item__header">
          <div className="post-item__logo">
            <IconPostLogo />
          </div>
          <span className="post-item__provider">{ this.state.provider }</span>
        </header>
        <h1 className="post-item__title">{ this.state.title }</h1>
        <div className="post-item__description">
          <p>{ this.state.description }</p>
        </div>
        <aside className="post-item__meta">
          <time className="post-item__date">{ this.state.date }</time>
        </aside>
      </div>
      <div className="post-item__thumbnail"></div>
    </article>);
  }
}
