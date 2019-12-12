import React, { Component } from 'react';
import AppContext from '../../contexts/AppContext';

import './Posts.scss';

import PostItem from '../PostItem/PostItem';

export default class Posts extends Component
{
  static contextType = AppContext;

  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
      <main className="posts">
        {this.context.connected && (
          <>
          <PostItem />
          <PostItem />
          <PostItem />
          <PostItem />
          <PostItem />
          <PostItem />
          <PostItem />
          </>
        )}
      </main>
    );
  }
}
