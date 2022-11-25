import "./App.css";
import "./styles/style.css";
import Die from "./components/Die";
import React, { useState } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { useTimer } from "use-timer";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [counter, setCounter] = React.useState(0);
  const { time, start, pause, reset, status } = useTimer();
  const [bestTime, setBestTime] = React.useState(0);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setBestTime((prevTime) =>
        prevTime > 1 && prevTime < yourTime ? prevTime : yourTime
      );
      setTenzies(true);
      pause();
      console.log("You won!");
    }
  }, [dice]);

  localStorage.setItem(
    "highscore",
    JSON.stringify(bestTime > 0 ? bestTime : 0)
  );
  let data = localStorage.getItem("highscore");

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
    start();
  }

  function rollDice() {
    let count = 0;
    const increase = () => {
      setCounter((count) => count + 1);
      console.log(count);
    };
    const restart = () => {
      setCounter(0);
    };
    if (!tenzies) {
      increase();
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      reset();
      restart();
      setTenzies(false);
      setDice(allNewDice());
    }
  }
  const yourTime = time;
  console.log(yourTime);
  return (
    <div className="App">
      <main className="main-container">
        {tenzies && <Confetti />}
        <div className="scores-container">
          <div>Rolls : {counter}</div>
          <div>Your Best : {(data = JSON.parse(data))}s</div>
          <div>Time: {time}s</div>
        </div>
        <h1 className="tenzies-title">Tenzies</h1>
        <p className="description">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dice-container">{diceElements}</div>
        <button className="roll-btn" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </main>
    </div>
  );
}
