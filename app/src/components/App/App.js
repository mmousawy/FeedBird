import React from 'react';
import {
  BrowserRouter as Router
} from 'react-router-dom';

import Routes from '../Routes/Routes';
import { ApiContextProvider } from '../../state/ApiContext';

import './App.scss';

export default function App() {
  return (
    <ApiContextProvider>
      <Router>
        <Routes />
      </Router>
    </ApiContextProvider>
  );
}
