import React, { useContext } from 'react';
import SplashScreen from '../SplashScreen/SplashScreen';
import { ApiContext } from '../../state/ApiContext';

export default function ApiService(props) {
  const state = useContext(ApiContext);

  return (
    state.connected
      ? props.children
      : <SplashScreen></SplashScreen>
  );
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

// export class ApiPayload
// {
//   constructor(namespace = 'none', data = [])
//   {
//     this.namespace = namespace;
//     this.data = data;
//   }

//   pack()
//   {
//     return {
//       namespace: this.namespace,
//       data: this.data
//     };
//   }
// }
