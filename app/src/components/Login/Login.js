import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import LoginBackground from '../LoginBackground/LoginBackground';
import { ApiContext, ApiPayload } from '../../state/ApiContext';

import './Login.scss';

import { ReactComponent as ImgLogo } from '../../assets/logo.svg';

export default class Login extends Component
{
  static contextType = ApiContext;

  constructor(props)
  {
    super(props);

    this.state = {
      email: '',
      password: '',
      authenticated: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount()
  {
    // Set up subscription ID for current component
    this.setState(prevState => {
      prevState.subscriptionId = this.context.subscribe(this.parseAuth.bind(this));

      return prevState;
    });

    const foundToken = window.localStorage.getItem('authToken');

    if (!foundToken) {
      return;
    }

    this.context.setState(prevState => {
      prevState.authToken = foundToken;
      prevState.authenticated = true;
    });

    this.setState(prevState => {
      prevState.authenticated = true;

      return prevState;
    });

    this.props.setAuthenticated();
  }

  parseAuth(newData)
  {
    console.log(newData);
    if (!newData.auth) {
      return;
    }

    window.localStorage.setItem('authToken', newData.auth.token);

    this.context.setState(prevState => {
      prevState.authToken = newData.auth.token;
      prevState.authenticated = true;
    });

    this.setState(prevState => {
      prevState.authenticated = true;

      return prevState;
    });

    this.props.setAuthenticated();
  }

  submitForm(event)
  {
    // Attempt login
    const payload = new ApiPayload({
      schema: 'user',
      query: `{
        auth {
          uid,
          firstname,
          lastname,
          token
        }
      }`,
      data: {
        email: this.state.email,
        password: this.state.password
      },
      id: this.state.subscriptionId
    });

    this.context.send(payload.pack());

    event.preventDefault();
  }

  handleInputChange(event)
  {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render()
  {
    if (this.state.authenticated) {
      return <Redirect to="/"></Redirect>;
    }

    return (
      <div className="login-screen">
        <div className="login-screen__background">
          <LoginBackground />
        </div>
        <div className="login-screen__content">
          <div className="login-screen__logo">
            <ImgLogo title="FeedBird logo" />
          </div>
          <h1 className="login-screen__title">FeedBird</h1>
          <p className="login-screen__description">Log in or sign up to continue.</p>
          <form className="login-screen__form" onSubmit={ this.submitForm.bind(this) }>
            <input type="email" className="login-screen__input" placeholder="Email" name="email" value={ this.state.email } onChange={ this.handleInputChange } />
            <input type="password" className="login-screen__input" placeholder="Password" name="password" value={ this.state.password } onChange={ this.handleInputChange } />
            <button type="submit" className="login-screen__submit">Log in</button>
            <div className="login-screen__separator"><span>OR</span></div>
            <Link className="login-screen__signup-link" to="signup">Sign up</Link>
          </form>
        </div>
      </div>
    );
  }
}
