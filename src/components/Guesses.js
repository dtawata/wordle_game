import React from 'react';


const Guesses = (props) => {
  const { state } = props;

  return (
    <div className='left'>
      {state.guesses.map((guess, index) => {
        return <Guess guess={guess} charCss={state.charCss[index]} key={index} />
      })}
    </div>
  );
};

const Guess = (props) => {
  const { guess, charCss } = props;

  return (
    <div className='guess'>
      <div className={charCss[0]}>{guess[0]}</div>
      <div className={charCss[1]}>{guess[1]}</div>
      <div className={charCss[2]}>{guess[2]}</div>
      <div className={charCss[3]}>{guess[3]}</div>
      <div className={charCss[4]}>{guess[4]}</div>
    </div>
  );
};

export default Guesses;