import React from 'react';

const Modal = (props) => {
  const { state, answer, startNewGame } = props;

  return (
    <div className='modal'>
      <div className='inner'>
        <div className='status'>{state.gameOver}</div>
        <div className='answer'>Answer: {answer.current}</div>
        <div onClick={startNewGame} className='new_game_button'>Play Again</div>
      </div>
    </div>
  );
};

export default Modal;