import React from 'react'
import nanoid from 'nanoid';

import SplashScreen from '../components/SplashScreen/SplashScreen';

export const ApiContext = React.createContext();

export class ApiContextProvider extends React.Component
{
  constructor(props)
  {
    super(props);

    let webSocketUrl = this.props.webSocketUrl || `ws://${ window.location.hostname }:8080`;

    this.state = {
      cache: {},
      connected: false,
      authenticated: false,
      setConnection: (status) => {
        this.setState({
          connected: status
        });
      },
      socket: new WebSocket(webSocketUrl),
      subscribe: (callback) => {
        const id = nanoid();

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

    this.state.socket.onopen = () => {
      // Connection established
      this.state.setConnection(true);

      console.log('Connected!');
    };

    this.state.send = (payload) => {
      // Connection established
      this.state.socket.send(payload);
    };

    this.state.socket.onmessage = (event) => {
      // Message received from server
      this.parseMessage(event);
    }
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
    if (!this.state.connected) {
      return <SplashScreen></SplashScreen>;
    }

    return (
      <ApiContext.Provider value={ this.state }>
        { this.props.children }
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
