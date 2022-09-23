import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// import styles from './App.module.css';

const App = (props) => {
  const [answer, setAnswer] = useState();
  const [obj, setObj] = useState({});
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([[],[],[],[],[],[]])
  const [valid, setValid] = useState('Submit');
  const input = useRef();
  const num = useRef(0);
  const [streak, setStreak] = useState(0);
  const [newGame, setNewGame] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [stylings, setStylings] = useState([['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char']]);
  const [lettersCss, setLettersCss] = useState(['letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter']);
  const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/api/word');
      const map = {};
      for (const char of data) {
        map[char] = map[char] || 0;
        map[char]++;
      }
      setObj(map);
      setAnswer(data);
      setStylings([['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char'],['char','char','char','char','char']]);
      setLettersCss(['letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter','letter']);
      setGuesses(([[],[],[],[],[],[]]));
      num.current = 0;
    })();
    input.current.focus();
  }, [newGame])

  useEffect(() => {
    if (num.current === 6) return;
    const guessesClone = [...guesses];
    for (let i = 0; i < 5; i++) {
      guessesClone[num.current][i] = guess[i];
    }
    setGuesses(guessesClone);
    if (guess.length < 5) {
      setValid('Pending');
      return;
    }
    (async () => {
      const { data } = await axios.get(`/api/valid/${guess}`);
      if (data) setValid('Submit');
      else setValid('Not a Word');
    })();
  }, [guess])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valid !== 'Submit') return;
    const stylingsClone = stylings.slice();
    const lettersCssClone = lettersCss.slice();
    let tally = 0;
    const objClone = { ...obj };
    for (let i = 0; i < 5; i++) {
      const letterIdx = letters.indexOf(guess[i].toUpperCase());
      if (answer[i] === guess[i]) {
        stylingsClone[num.current][i] = 'char green';
        lettersCssClone[letterIdx] = 'letter green';
        tally++;
        objClone[guess[i]]--;
      }
    }
    if (tally === 5) {
      setStreak((prevStreak) => {
        return prevStreak + 1;
      });
      setGameOver('You Won!');
    }

    for (let i = 0; i < 5; i++) {
      if (answer[i] === guess[i]) continue;
      const letterIdx = letters.indexOf(guess[i].toUpperCase());
      if (objClone[guess[i]]) {
        stylingsClone[num.current][i] = 'char orange';
        if (lettersCssClone[letterIdx] !== 'letter green') {
          lettersCssClone[letterIdx] = 'letter orange';
        }
        objClone[guess[i]]--;
      } else {
        stylingsClone[num.current][i] = 'char black';
        if (lettersCssClone[letterIdx] === 'letter') {
          lettersCssClone[letterIdx] = 'letter black';
        }
      }
    }
    setStylings(stylingsClone);
    const guessesClone = guesses.slice();
    guessesClone[num.current] = guess.split('');
    setGuesses(guessesClone);
    setLettersCss(lettersCssClone);
    num.current++;
    input.current.value = '';
    setGuess('');
    if (num.current === 6) {
      setGameOver(`You Lost! The answer was: ${answer}.`);
      setStreak(0);
    }
  };

  const handleChange = () => {
    setGuess(input.current.value);
  };

  const startNewGame = () => {
    setNewGame(!newGame);
    setGameOver(false);
  };

  return (
    <div className='container'>
      <div className='main'>
        <div className='left'>
          <div className='guess'>
            <div className={stylings[0][0]}>{guesses[0][0]}</div>
            <div className={stylings[0][1]}>{guesses[0][1]}</div>
            <div className={stylings[0][2]}>{guesses[0][2]}</div>
            <div className={stylings[0][3]}>{guesses[0][3]}</div>
            <div className={stylings[0][4]}>{guesses[0][4]}</div>
          </div>
          <div className='guess'>
            <div className={stylings[1][0]}>{guesses[1][0]}</div>
            <div className={stylings[1][1]}>{guesses[1][1]}</div>
            <div className={stylings[1][2]}>{guesses[1][2]}</div>
            <div className={stylings[1][3]}>{guesses[1][3]}</div>
            <div className={stylings[1][4]}>{guesses[1][4]}</div>
          </div>
          <div className='guess'>
            <div className={stylings[2][0]}>{guesses[2][0]}</div>
            <div className={stylings[2][1]}>{guesses[2][1]}</div>
            <div className={stylings[2][2]}>{guesses[2][2]}</div>
            <div className={stylings[2][3]}>{guesses[2][3]}</div>
            <div className={stylings[2][4]}>{guesses[2][4]}</div>
          </div>
          <div className='guess'>
            <div className={stylings[3][0]}>{guesses[3][0]}</div>
            <div className={stylings[3][1]}>{guesses[3][1]}</div>
            <div className={stylings[3][2]}>{guesses[3][2]}</div>
            <div className={stylings[3][3]}>{guesses[3][3]}</div>
            <div className={stylings[3][4]}>{guesses[3][4]}</div>
          </div>
          <div className='guess'>
            <div className={stylings[4][0]}>{guesses[4][0]}</div>
            <div className={stylings[4][1]}>{guesses[4][1]}</div>
            <div className={stylings[4][2]}>{guesses[4][2]}</div>
            <div className={stylings[4][3]}>{guesses[4][3]}</div>
            <div className={stylings[4][4]}>{guesses[4][4]}</div>
          </div>
          <div className='guess'>
            <div className={stylings[5][0]}>{guesses[5][0]}</div>
            <div className={stylings[5][1]}>{guesses[5][1]}</div>
            <div className={stylings[5][2]}>{guesses[5][2]}</div>
            <div className={stylings[5][3]}>{guesses[5][3]}</div>
            <div className={stylings[5][4]}>{guesses[5][4]}</div>
          </div>
        </div>
        <div className='right'>
          {/* <div className='answer'>{answer}</div> */}
          <form onSubmit={handleSubmit}>
            <input onChange={handleChange} type='text' maxLength={5} placeholder='next guess...' ref={input} />
            <button type='submit'>{valid}</button>
          </form>
          <div className='letters'>
            {letters.map((letter, index) => {
              return <div className={lettersCss[index]} key={index}>{letter}</div>;
            })}
          </div>
          <div className='streak'>Win Streak: {streak}</div>
        </div>
      </div>
      {gameOver && <div className='modal'>
        <div className='inner'>
          <div className='status'>{gameOver}</div>
          <div onClick={startNewGame} className='new_game_button'>Play Again?</div>
        </div>
      </div>}
    </div>
  );
};

export default App;