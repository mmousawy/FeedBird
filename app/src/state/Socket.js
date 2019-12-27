import { store as notify } from '../components/Notifications/Notifications';

export default class Socket
{
  constructor(webSocketUrl, callbacks)
  {
    this.webSocketUrl = webSocketUrl;

    this.openHandler = this.openHandler.bind(this, callbacks.open);
    this.messageHandler = this.messageHandler.bind(this, callbacks.message);
    this.closeHandler = this.closeHandler.bind(this, this.reset.bind(this));
    this.notify = callbacks.notify;

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

    openCallback();

    this.connected = true;

    notify.addNotification(`You're now connected!`);
  }

  messageHandler(messageCallback, event)
  {
    messageCallback(event);
  }

  closeHandler(closeCallback)
  {
    console.warn('Disconnected!');

    closeCallback();

    if (this.connected === true) {
      // Disconnected when previously was connected
      this.connected = false;

      // Show notification
      notify.addNotification(`You've gone offline!`);
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
}
