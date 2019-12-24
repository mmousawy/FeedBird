import React from 'react';
import { ApiContext, ApiPayload } from '../../state/ApiContext';
import PostItem from '../PostItem/PostItem';
import PostItemSkeleton from '../PostItem/PostItemSkeleton';

import './Posts.scss';

export default class Posts extends React.Component {
  static contextType = ApiContext;

  constructor(props)
  {
    super(props);

    this.state = {
      posts: null
    };
  }

  componentDidMount()
  {
    if (!this.context.connected) {
      return;
    }

    if (this.context.cache.posts) {
      this.setState(prevState => {
        prevState.posts = this.context.cache.posts;

        return prevState;
      });
    }

    // Subscribe to posts namespace
    this.setState(prevState => {
      prevState.subscriptionId = this.context.subscribe(this.parsePosts.bind(this));

      const payload = new ApiPayload({
        schema: 'post',
        query: `{
          posts {
            title,
            source_provider,
            description,
            url,
            date
          }
        }`,
        id: prevState.subscriptionId
      });

      this.context.send(payload.pack());

      return prevState;
    });
  }

  componentWillUnmount()
  {
    // Unsubscribe from posts namespace
    this.context.unsubscribe(this.state.subscriptionId);
  }

  parsePosts(data)
  {
    console.log(data);
    this.setState(prevState => {
      prevState.posts = data.posts;

      this.context.setState(prevState => {
        prevState.cache.posts = data.posts;
      });

      return prevState;
    });
  }

  render()
  {
    return (
      <main className="posts">
        <React.Fragment>
          {
            this.state.posts && this.state.posts.length > 0
              ? (this.state.posts.map((post, index) => {
                  return <PostItem data={ post } key={ index } />;
                }))
              : [
                  <PostItemSkeleton key="1"></PostItemSkeleton>,
                  <PostItemSkeleton key="2"></PostItemSkeleton>,
                  <PostItemSkeleton key="3"></PostItemSkeleton>
                ]
          }
        </React.Fragment>
      </main>
    );
  }
}
