import React from 'react';
import NotificationItem from '../NotificationItem/NotificationItem';

import './Notifications.scss';

export const store = {};

export class Notifications extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      notifications: []
    };

    this.notificationTimeout = 3000;

    store.addNotification = this.addNotification.bind(this);
  }

  addNotification(message)
  {
    const messageId = (new Date()).toISOString();

    this.setState(prevState => {
      prevState.notifications = [
        ...prevState.notifications,
        {
          message,
          id: messageId
        }
      ];

      window.setTimeout(this.removeNotification.bind(this, messageId), this.notificationTimeout);

      return prevState;
    });
  }

  removeNotification(messageId)
  {
    this.setState(prevState => {
      prevState.notifications = prevState.notifications.filter(notification => notification.id !== messageId);

      return prevState;
    });
  }

  componentDidMount()
  {
    if (!this.context.connected) {
      return;
    }

    // Subscribe to notifications
    this.setState(prevState => {
      prevState.subscriptionId = this.context.subscribe(this.parseNotifications.bind(this));
    });
  }

  render()
  {
    return (
      <div className="notifications-overlay">
        {
          this.state.notifications && this.state.notifications.length > 0
            ? (this.state.notifications.map((notification, index) => {
                return <NotificationItem data={ notification.message } key={ index } />;
              }))
            : null
        }
      </div>
    );
  }
}
