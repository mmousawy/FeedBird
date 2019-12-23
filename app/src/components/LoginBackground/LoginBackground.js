import React from 'react';

export default class LoginBackground extends React.Component
{
  constructor(props)
  {
    super(props);

    this.cardAmount = 0;
  }

  componentDidMount()
  {
  }

  createCards()
  {
    const cards = [];

    for (let i = 0; i < this.cardAmount; i++) {
      const randomDelay = {
        animationDelay: `${Math.random()}s`,
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        transform: `scale(${Math.random()})`
      };

      const card = <div className="login-screen__background-card" key={ i } style={ randomDelay }></div>;

      cards.push(card);
    }

    return cards;
  }

  render()
  {
    return <React.Fragment>
      {this.createCards()}
    </React.Fragment>;
  }
}
