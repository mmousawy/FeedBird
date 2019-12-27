import React from 'react';
import {
  BrowserRouter as Router
} from 'react-router-dom';

import { ApiContextProvider } from '../../state/ApiContext';
import { Notifications } from '../Notifications/Notifications';
import Routes from '../Routes/Routes';

import './App.scss';

export default function App() {
  return (
    <ApiContextProvider>
      <Notifications />
      <Router>
        <Routes />
      </Router>
    </ApiContextProvider>
  );
}
