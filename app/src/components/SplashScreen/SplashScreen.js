import React from 'react';
import SVG from 'react-inlinesvg';

import './SplashScreen.scss';

import imgLogo from '../../assets/logo.svg';

export default function SplashScreen(props) {
  return (
    <div className="splash-screen">
      <div className="splash-screen__content">
        <SVG src={imgLogo} />
      </div>
    </div>
  );
}
