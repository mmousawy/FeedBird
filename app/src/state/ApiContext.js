import React from 'react'

export const ApiContext = React.createContext();

export class ApiContextProvider extends React.Component
{
  constructor(props)
  {
    super(props);

    let webSocketUrl = this.props.webSocketUrl || 'ws://localhost:8080';

    this.state = {
      connected: false,
      setConnection: (status) => {
        this.setState({
          connected: status
        });
      },
      socket: new WebSocket(webSocketUrl)
    };
  }

  componentDidMount()
  {
    this.state.socket.onopen = () => {
      // Connection established
      this.state.setConnection(true);
    };
  }

  render()
  {
    return (
      <ApiContext.Provider value={ this.state }>
        { this.props.children }
      </ApiContext.Provider>
    );
  }
}
