import React from 'react';

import './NotificationItem.scss';

export default class NotificationItem extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
      <div className="notification">
        { this.props.data }
      </div>
    );
  }
}
