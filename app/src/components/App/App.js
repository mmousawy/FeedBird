import React, { Component } from 'react';
import './App.css';
import Header from '../Header/Header';
import NavBar from '../NavBar/NavBar';
import Posts from '../Posts/Posts';
import AppContext from '../../contexts/AppContext/AppContext';
import ApiService from '../ApiService/ApiService';

export default function App() {
  return (
    <AppContext.Provider value={{
      connected: false
    }}>
      <ApiService />
      <div className="FeedBird-app">
        <Header />
        <Posts />
        <NavBar />
      </div>
    </AppContext.Provider>
  );
}
