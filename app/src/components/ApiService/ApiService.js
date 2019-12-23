import React from 'react';
import SplashScreen from '../SplashScreen/SplashScreen';
import { ApiContext, ApiPayload } from '../../state/ApiContext';

export default function ApiService(props) {
  const apiContext = React.useContext(ApiContext);

  if (!apiContext.connected) {
    return <SplashScreen></SplashScreen>;
  }

  return props.children;
}

  // function connect()
  // {
  //

  //   socket.onmessage = function(event) {
  //     // Message received
  //   };

  //   socket.onclose = function(event) {
  //     if (event.wasClean) {
  //       alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  //     } else {
  //       // e.g. server process killed or network down
  //       // event.code is usually 1006 in this case
  //       alert('[close] Connection died');
  //     }
  //   };

  //   socket.onerror = function(error) {
  //     alert(`[error] ${error.message}`);
  //   };
  // }

  // function send(payload)
  // {
  //   if (socket) {
  //     socket.send(payload);
  //   }
  // }
