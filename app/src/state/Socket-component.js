import React from 'react';

export default class Socket extends React.PureComponent
{
  constructor(props)
  {
    super(props);

    this.webSocketUrl = props.url;

    this.openHandler = this.openHandler.bind(this, props.callbacks.open);
    this.messageHandler = this.messageHandler.bind(this, props.callbacks.message);
    this.closeHandler = this.closeHandler.bind(this, this.reset.bind(this));

    this.connected = null;

    this.init();
  }

  send(payload)
  {
    // Send payload through socket
    this.socket.send(payload);
  }

  init()
  {
    this.socket = new WebSocket(this.webSocketUrl);

    this.socket.addEventListener('open', this.openHandler);
    this.socket.addEventListener('error', this.closeHandler);
    this.socket.addEventListener('close', this.closeHandler);
    this.socket.addEventListener('message', this.messageHandler);
  }

  openHandler(openCallback)
  {
    console.log('Connected!');

    console.log(this.context);

    openCallback();
    this.connected = true;
  }

  messageHandler(messageCallback, event)
  {
    messageCallback(event);
  }

  closeHandler(closeCallback)
  {
    console.warn('Disconnected!');
    closeCallback();


    if (this.connected === null) {
      // Disconnected when previously was connected
      this.connected = false;

      // Show notification
    }
  }

  reset()
  {
    this.destroy();
    this.init();
  }

  destroy()
  {
    this.socket.removeEventListener('open', this.openHandler);
    this.socket.removeEventListener('error', this.closeHandler);
    this.socket.removeEventListener('close', this.closeHandler);
    this.socket.removeEventListener('message', this.messageHandler);
  }

  render()
  {
    return null;
  }
}
