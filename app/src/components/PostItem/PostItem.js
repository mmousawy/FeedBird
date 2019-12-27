import React, { Component } from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

import { ReactComponent as IconPostLogo } from '../../assets/icons/hexagon.svg';

import './PostItem.scss';

dayjs.extend(relativeTime);

export default class PostItem extends Component
{
  constructor(props)
  {
    super(props);

    this.state = props.data;
    this.state.dateClean = dayjs(this.state.date).fromNow();
  }

  render()
  {
    return (<article className="post-item">
      <div className="post-item__content">
        <header className="post-item__header">
          <div className="post-item__logo">
            <IconPostLogo />
          </div>
          <span className="post-item__provider">{ this.state.source_provider.name }</span>
        </header>
        <h1 className="post-item__title">{ this.state.title }</h1>
        <div className="post-item__description">
          <p>{ this.state.description }</p>
        </div>
        <aside className="post-item__meta">
          <time className="post-item__date" dateTime={ this.state.date }>{ this.state.dateClean }</time>
        </aside>
      </div>
      <div className="post-item__thumbnail"></div>
    </article>);
  }
}
