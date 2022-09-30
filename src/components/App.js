import React, { useState, useRef, useEffect, useReducer } from 'react';
import axios from 'axios';
import Guesses from './Guesses';
import Modal from './Modal';

const reducer = (state, action) => {
  switch (action.type) {
    case 'initialize':
      return {
        guesses: [[],[],[],[],[],[]],
        charCss: [['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char']],
        letterCss: ['letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter'],
        button: { text: 'Submit', css: 'button disabled' }
      }
    case 'updateGuess':
      const updateState = { ...state };
      updateState.guesses[action.attempt] = action.guess.split('');
      updateState.button = action.valid;
      return updateState;
    case 'submit':
      const submitState = { ...state };
      const map = { ...action.map };
      let tally = 0;
      for (let i = 0; i < 5; i++) {
        if (action.answer[i] === action.guess[i]) {
          submitState.charCss[action.attempt][i] = 'char green';
          const letterIdx = action.letters.indexOf(action.guess[i].toUpperCase());
          submitState.letterCss[letterIdx] = 'letter green';
          map[action.guess[i]]--;
          tally++;
        }
      }
      if (tally === 5) {
        submitState.button = { text: 'Submit', css: 'button disabled' };
        submitState.gameOver = 'winner';
        return submitState;
      }
      for (let i = 0; i < 5; i++) {
        if (submitState.charCss[action.attempt][i] === 'char green') continue;
        const letterIdx = action.letters.indexOf(action.guess[i].toUpperCase());
        if (map[action.guess[i]]) {
          submitState.charCss[action.attempt][i] = 'char orange';
          if (submitState.letterCss[letterIdx] !== 'letter green') {
            submitState.letterCss[letterIdx] = 'letter orange';
          }
          map[action.guess[i]]--;
        } else {
          submitState.charCss[action.attempt][i] = 'char black';
          if (submitState.letterCss[letterIdx] === 'letter') {
            submitState.letterCss[letterIdx] = 'letter black';
          }
        }
      }
      submitState.button = { text: 'Submit', css: 'button disabled' };
      if (action.attempt === 5) submitState.gameOver = 'loser';
      return submitState;
    default:
      throw new Error('not a valid type');
  }
};

const ACTION = {
  INITIALIZE: 'initialize',
  UPDATE_GUESS: 'updateGuess',
  SUBMIT: 'submit'
};

const App = (props) => {

  const [state, dispatch] = useReducer(reducer, {
    guesses: [[],[],[],[],[],[]],
    charCss: [['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char']],
    letterCss: ['letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter'],
    button: { text: 'Submit', css: 'button' },
    gameOver: false
  });

  const [game, setGame] = useState(1);
  const answer = useRef('');
  const map = useRef({});
  const attempt = useRef(0);
  const input = useRef();

  const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/api/word');
      answer.current = data;
      // answer.current = 'ready';
      for (const char of answer.current) {
        map.current[char] = map.current[char] || 0;
        map.current[char]++;
      }
      attempt.current = 0;
      input.current.focus();
      dispatch({
        type: ACTION.INITIALIZE
      });
    })();
  }, [game])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.button.css !== 'button submit' || attempt.current === 6 || state.gameOver) return;
    dispatch({
      type: ACTION.SUBMIT,
      guess: input.current.value,
      attempt: attempt.current,
      answer: answer.current,
      map: map.current,
      letters
    });
    input.current.value = '';
    attempt.current++;
  };

  const handleChange = (e) => {
    if (attempt.current === 6) return;
    if (input.current.value.length < 5) {
      dispatch({
        type: ACTION.UPDATE_GUESS,
        guess: input.current.value,
        attempt: attempt.current,
        valid: { text: 'Submit', css: 'button disabled' }
      });
    } else {
      (async () => {
        const { data } = await axios.get(`/api/valid/${input.current.value}`);
        dispatch({
          type: ACTION.UPDATE_GUESS,
          guess: input.current.value,
          attempt: attempt.current,
          valid: data ? { text: 'Submit', css: 'button submit' } : { text: 'Not a Word', css: 'button invalid' }
        });
      })();
    }
  };

  const startNewGame = () => {
    setGame((prevGame) => {
      return prevGame + 1;
    });
  };

  const keyDownHandler = (e) => {
    if (e.key === 'Enter') startNewGame();
  };

  useEffect(() => {
    if (state.gameOver) {
      document.addEventListener('keydown', keyDownHandler);
      return () => {
        document.removeEventListener('keydown', keyDownHandler);
      };
    }
  }, [state.gameOver])

  return (
    <div className='container'>
      <div className='main'>
        <Guesses state={state} />
        <div className='right'>
          <form onSubmit={handleSubmit}>
            <input onChange={handleChange} type='text' maxLength={5} placeholder='next guess...' ref={input} />
            <button className={state.button.css} type='submit'>{state.button.text}</button>
          </form>
          <div className='letters'>
            {letters.map((letter, index) => {
              return <div className={state.letterCss[index]} key={index}>{letter}</div>;
            })}
          </div>
          <div className='game_count'>Game #: {game}</div>
        </div>
        {state.gameOver && <Modal state={state} answer={answer} startNewGame={startNewGame} />}
      </div>
    </div>
  );
};

export default App;