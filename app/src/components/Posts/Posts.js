import React from 'react';

import './Posts.scss';

import PostItem from '../PostItem/PostItem';

export default function Posts() {
  return (
    <main className="posts">
      <React.Fragment>
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
      </React.Fragment>
    </main>
  );
}
