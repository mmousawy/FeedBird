import React, { Component } from 'react';

import './PostItem.scss';

export default class PostItemSkeleton extends Component
{
  render()
  {
    return (<article className="post-item post-item--skeleton">
      <div className="post-item__content">
        <header className="post-item__header">
          <div className="post-item__logo"></div>
          <span className="post-item__provider"></span>
        </header>
        <span className="post-item__title"></span>
        <div className="post-item__description">
          <p></p>
        </div>
        <aside className="post-item__meta">
          <time className="post-item__date"></time>
        </aside>
      </div>
      <div className="post-item__thumbnail"></div>
    </article>);
  }
}
