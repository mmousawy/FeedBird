import React, { useReducer } from 'react'
import nanoid from 'nanoid';
import Socket from './Socket';

import SplashScreen from '../components/SplashScreen/SplashScreen';

export const ApiContext = React.createContext();

export class ApiContextProvider extends React.Component
{
  constructor(props)
  {
    super(props);

    this.socket = React.createRef();

    this.state = {
      cache: {},
      socket: this.socket.current,
      webSocketUrl: this.props.webSocketUrl || `ws://${ window.location.hostname }:8080`,
      connected: false,
      authenticated: false,
      setConnection: (status) => {
        this.setState({
          connected: status
        });
      },
      subscribe: (callback) => {
        const id = nanoid(8);

        this.setState(prevState => {
          prevState.subscriptions[id] = {
            callback,
            id
          };

          return prevState;
        });

        return id;
      },
      unsubscribe: (subscriptonId) => {
        this.setState(prevState => {
          delete prevState.subscriptions[subscriptonId];

          return;
        })
      },
      subscriptions: {},
      setState: this.setState.bind(this)
    };
  }

  parseMessage(event = { data: '[]' })
  {
    const data = JSON.parse(event.data);

    for (let id in this.state.subscriptions) {
      if (id === data.id) {
        const subscripton = this.state.subscriptions[id];
        console.log(data);
        subscripton.callback(data.data);
      }
    }
  }

  componentDidMount()
  {

  }

  render()
  {
    return (
      <ApiContext.Provider value={ this.state }>
        <Socket
          ref={ this.socket }
          url={ this.state.webSocketUrl }
          callbacks={{
            open: this.state.setConnection.bind(this, true),
            message: this.parseMessage.bind(this)
          }}
        />
        { this.state.connected
          ? this.props.children
          : <SplashScreen />
        }
      </ApiContext.Provider>
    );
  }
}

export class ApiPayload
{
  constructor(options = {})
  {
    this.options = options;
  }

  pack()
  {
    return JSON.stringify(this.options);
  }
}
