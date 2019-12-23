import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';
import { Link, Redirect } from 'react-router-dom';
import { ApiContext, ApiContextProvider } from '../../state/ApiContext';

import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';
import Posts from '../Posts/Posts';
import Login from '../Login/Login';

export default class Routes extends React.Component
{
  static contextType = ApiContext;

  constructor(props)
  {
    super(props);

    this.state = {
      authenticated: false
    };

    this.setAuthenticated = this.setAuthenticated.bind(this);
  }

  setAuthenticated()
  {
    this.setState(prevState => {
      prevState.authenticated = true;

      return prevState;
    })
  }

  render()
  {
    if (!this.state.authenticated) {
      return <Login setAuthenticated={ this.setAuthenticated } />;
    }

    return (
      <React.Fragment>
        <Header />
          <Switch>
            <Route path="/manage">
              {/* <Manage /> */}
            </Route>
            <Route path="/explore">
              {/* <Explore /> */}
            </Route>
            <Route path="/">
              <Posts />
            </Route>
          </Switch>
        <NavBar />
      </React.Fragment>
    );
  }
}
