'use strict';

const getElem = id => document.getElementById(id);

let handlePlay = getElem('start_stop'),
    sessionLabel = getElem('session-length'),
    breakLabel = getElem('break-length'),
    sessionDecrement = getElem('session-decrement'),
    sessionIncrement = getElem('session-increment'),
    reset = getElem('reset'),
    breakIncrement = getElem('break-increment'),
    breakDecrement = getElem('break-decrement'),
    changeBell = getElem('change-bell'),
    timeLeft = getElem('time-left'),
    beep = getElem('beep'),
    timerLabel = getElem('timer-label'),
    hide = getElem('hide'),
    sessionValue = Number(sessionLabel.getAttribute('data-value')),
    breakValue = Number(breakLabel.getAttribute('data-value'));


sessionLabel.innerHTML = sessionValue;
breakLabel.innerHTML = breakValue;
timeLeft.innerText = "25:00"


let toggleVisibility = (elem, add, remove) => {
  let toggled = elem.classList.toggle(add);
  if (!toggled) elem.classList.add(remove);
}


function handleSixty(str, timeLeft) {
  let len = str.length;

  if (str.lastIndexOf('6') == len - 2) {
    let numStr = parseInt(str.slice(0, 2)) + 1;
    let strAggregate = numStr.toString() + ':' + '00';
    // pads zero to minutes 0-9
    numStr < 10 ? timeLeft.innerHTML = '0' + strAggregate : timeLeft.innerHTML = strAggregate;
  }

  else timeLeft.innerHTML = str.slice(0, 2) + ':' + str.slice(2);
}


function beepTimer(timer) {
  if (timer < 5 && timer >= 0) beep.play();
}


function breakTime(timer) {
  if (timer == 0) {
    timerLabel.innerHTML = 'Break Begins';
    timerLabel.style.color = 'firebrick'
  }
}

function handleIncreament(value) {

}

sessionDecrement.addEventListener('click', function() {
  if (sessionValue > 1) {
    let decrementValue = sessionValue -= 1;
    sessionLabel.innerHTML = decrementValue

    /**
     *displays zeros to single digits
     */

    if (decrementValue < 10) hide.style.display = 'inline';
  }
  else sessionLabel;
})


sessionIncrement.addEventListener('click', function() {
  if (sessionValue >= 0 && sessionValue < 60) {
    let incrementValue = sessionValue += 1;
    sessionLabel.innerHTML = incrementValue;
    if (incrementValue < 10) hide.style.display = 'inline';

    if (sessionValue >= 10) hide.style.display = 'none';
  } else sessionLabel;
})


breakDecrement.addEventListener('click', function() {
  breakValue > 1 ? breakLabel.innerHTML = breakValue -= 1 : breakValue;
});


breakIncrement.addEventListener('click', function() {
  breakValue > 0 && breakValue < 60 ? breakLabel.innerHTML = breakValue += 1 : breakValue;
});


function setOrRemove(elem, remove) {
  remove ? elem.removeAttribute('disabled') : elem.setAttribute('disabled', false)
}


function setAll() {
  setOrRemove(breakDecrement);
  setOrRemove(breakIncrement);
  setOrRemove(sessionDecrement);
  setOrRemove(sessionIncrement);
}


function removeAll() {
  setOrRemove(breakDecrement, 'disabled');
  setOrRemove(breakIncrement, 'disabled');
  setOrRemove(sessionDecrement, 'disabled');
  setOrRemove(sessionIncrement, 'disabled');
}


let timeInterval = (timer, breaker) => {
  setInterval(() => {
      timer -= 6;
      if (parseInt(timer) % 100 == 0 && timer !== 0) timer = parseInt(timer) - 40;
      //pads zeros to digits less than 4 places
      if (timer < 1000) timer = '0' + timer;
      if (timer < 100) timer = '0' + timer;
      if (timer < 10) timer = '0' + timer;

      if (timer >= 0) {
        let formattedStr = timer.toString();
        handleSixty(formattedStr, timeLeft);
      }

      let parseBreak = parseInt(breaker);
      if (isNaN(timer) && breaker > 1 || timer <= 0 && breaker > 1) {
        breaker -= 10;
        if (parseBreak % 100 == 0 && timer !== 0) breaker = parseBreak - 40;

        if (breaker < 1000) breaker = '0' + breaker;
        if (breaker < 100) breaker = '0' + breaker;
        if (breaker < 10) breaker = '0' + breaker;

        if (breaker <= 0) {
          timerLabel.innerHTML = 'Timer & Break Elapsed';
          timerLabel.style.fontStyle = 'italic';
          timerLabel.style.fontWeight = 'bolder';
          timerLabel.style.color = '#E31C25'
        }
        let formattedStr = breaker.toString();
        handleSixty(formattedStr, timeLeft);
      }

      beepTimer(timer);
      breakTime(timer);
    },
    1000)
}
let times = [true]

function stopInterval(th) {
  clearInterval(th)
}

reset.addEventListener('click', function() {
  sessionValue = 25;
  breakValue = 5;
  sessionLabel.innerHTML = sessionValue;
  breakLabel.innerHTML = breakValue;
  removeAll();

  handlePlay.removeEventListener('click', tog)
});


changeBell.addEventListener('click', function() {
  toggleVisibility(changeBell, 'fa-bell-slash', 'fa-bell');
});

handlePlay.addEventListener('click', function tog() {
  let timer = sessionValue * 100;
  let breaker = breakValue * 100;
  let time = 0;
  let classToggled = handlePlay.getAttribute('class');

  toggleVisibility(handlePlay, 'fa-play', 'fa-pause');
  setAll();

  if (classToggled.includes('fa-play')) {
    timerLabel.innerHTML = 'Session Ongoing';
    timerLabel.style.color = 'seagreen'
    timer -= 40;
    breaker -= 40;
    timeInterval(timer, breaker)
  }

  else if (!classToggled.includes("fa-play")) {
    timerLabel.innerHTML = 'Session Paused';
    timerLabel.style.color = '#F8A145';
    timeLeft.innerHTML = '25:00'
    /*setInterval(() => {
      timer = timer += 40
    }, 1000)
    /*  stopInterval()
      setInterval(() => {
          time += 1000;
          console.log(time)
          let pause = setTimeout(() => {
              timeInterval()
          }, 5000)
      }, 1000);*/
  }
});