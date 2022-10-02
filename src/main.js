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

let elems = [breakDecrement, breakIncrement, sessionDecrement, sessionIncrement];

sessionLabel.innerHTML = sessionValue;
breakLabel.innerHTML = breakValue;

let toggleClass = (elem, add, remove) => {
  let toggled = elem.classList.toggle(add);
  if (!toggled) elem.classList.add(remove);
}

function modifyAttr(elem, action) {
  elem.forEach(x => action(x));
}

/*** Main Timer Class ***/
class Timer {
  constructor() {
    this.running = false;
    this.sessionTime = sessionValue * 60;
    this.breakTime = breakValue * 60;
  }

  play() {
    this.running = true;
    timerLabel.innerHTML = 'Session Ongoing';
    timerLabel.style.color = 'seagreen'
  }

  pause() {
    this.running = false;
    timerLabel.innerHTML = 'Session Paused';
    timerLabel.style.color = '#F8A145'
  }

  reset() {
    this.running = false;
    this.sessionTime = 1500;
    this.breakTime = 600;
    timerLabel.innerHTML = 'Session Reset';
    timerLabel.style.color = '#F8A145'
    sessionLabel.innerHTML = "25"
    breakLabel.innerHTML = "5"

  }

  runTimer() {
    setInterval(() => {
      var mins = Math.floor((this.sessionTime % 3600) / 60);
      var secs = this.sessionTime % 60;
      timeLeft.innerText = `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;

      if (this.running) {
        this.sessionTime > 0 ? this.sessionTime -= 1 : "";
        this.sessionTime == 5 ? beep.play() : "";
        if (this.sessionTime < 1) {
          var secs = this.breakTime % 60;
          var mins = Math.floor((this.breakTime % 3600) / 60);
          timeLeft.innerText = `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
          this.breakTime >= 0 ? this.breakTime -= 1 : "";
          timerLabel.innerHTML = 'Break Begins';
          timerLabel.style.color = 'firebrick';
          if (this.breakTime == 0) {
            timerLabel.innerHTML = 'Timer & Break Elapsed';
            timerLabel.style.fontStyle = 'italic';
            timerLabel.style.fontWeight = 'bolder';
            timerLabel.style.color = '#E31C25';
          }
        }
      }
    }, 1000)
  }

  sessionIncrement() {
    this.sessionTime <= 3600 ? this.sessionTime += 60 : timeLeft.innerText = "60:00"
  }
  
  sessionDecrement() {
    this.sessionTime > 0 ?
      this.sessionTime -= 60 : "";
  }

  breakIncrement() {
    this.breakTime <= 3600 ? this.breakTime += 60 : "";
  }
  
  breakDecrement() {
    this.breakTime > 0 ?
      this.sessionTime -= 60 : "";
  }
}

let timer = new Timer();

document.addEventListener('DOMContentLoaded', function() {
  timer.runTimer();
});

handlePlay.addEventListener('click', function() {
  toggleClass(this, 'fa-play', 'fa-pause');
  modifyAttr(elems, s => s.setAttribute("disabled", false));
  this.classList.contains('fa-play') ? timer.pause() : timer.play();
});

reset.addEventListener('click', function() {
  timer.reset();
  handlePlay.classList.add("fa-play");
  modifyAttr(elems, r => r.removeAttribute("disabled"));
});

sessionDecrement.addEventListener('click', function() {
  timer.sessionDecrement();
  if (sessionValue > 1) {
    let decrementValue = sessionValue -= 1;
    sessionLabel.innerHTML = decrementValue;
    //displays zeros to single digits
    if (decrementValue < 10) hide.style.display = 'inline';
  }
  else sessionLabel;
});

sessionIncrement.addEventListener('click', function() {
  timer.sessionIncrement()
  if (sessionValue >= 0 && sessionValue < 60) {
    let incrementValue = sessionValue += 1;
    sessionLabel.innerHTML = incrementValue;
    if (incrementValue < 10) hide.style.display = 'inline';

    if (sessionValue >= 10) hide.style.display = 'none';
  } else sessionLabel;
})

breakDecrement.addEventListener('click', function() {
  timer.breakDecrement()
  breakValue > 1 ? breakLabel.innerHTML = breakValue -= 1 : breakValue;
});

breakIncrement.addEventListener('click', function() {
  timer.breakIncrement()
  breakValue > 0 && breakValue < 60 ? breakLabel.innerHTML = breakValue += 1 : breakValue;
});

changeBell.addEventListener('click', function() {
  toggleClass(this, 'fa-bell-slash', 'fa-bell');
});