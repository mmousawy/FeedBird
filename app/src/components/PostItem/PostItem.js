import React, { Component } from 'react';
import SVG from 'react-inlinesvg';

import './PostItem.scss';

import iconPostLogo from '../../assets/icons/hexagon.svg';

export default class PostItem extends Component
{
  render()
  {
    const post = {
      website: 'Lorem ipsum',
      title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
      description: 'Blanditiis debitis voluptatibus unde consequatur vero adipisci molestiae quae placeat iste explicabo fugiat, alias modi vel est, tempora ad magni dolorem. Aliquid!',
      date: '05-10-2019'
    };

    return (<article className="post-item">
      <div className="post-item__content">
        <header className="post-item__header">
          <div className="post-item__logo">
            <SVG src={ iconPostLogo } />
          </div>
          <span className="post-item__website">{ post.website }</span>
        </header>
        <h1 className="post-item__title">{ post.title }</h1>
        <div className="post-item__description">
          <p>{ post.description }</p>
        </div>
        <aside className="post-item__meta">
          <time className="post-item__date">{ post.date }</time>
        </aside>
      </div>
      <div className="post-item__thumbnail"></div>
    </article>);
  }
}
