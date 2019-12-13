import React from 'react';
import './App.css';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';
import Posts from '../Posts/Posts';
import { ApiContextProvider } from '../../state/ApiContext';
import ApiService from '../ApiService/ApiService';

export default function App() {
  return (
    <ApiContextProvider>
      <ApiService>
        <div className="FeedBird-app">
          <ApiContextProvider>
            <Header />
            <Posts />
            <NavBar />
          </ApiContextProvider>
        </div>
      </ApiService>
    </ApiContextProvider>
  );
}
