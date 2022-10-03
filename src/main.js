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

function toggleClass(elem, add, remove) {
  let toggled = elem.classList.toggle(add);
  if (!toggled) elem.classList.add(remove);
}

function modifyAttr(elem, action) {
  elem.forEach(x => action(x));
}

function sessionFormatter(value) {
  sessionValue = value;
  value < 10 ? hide.style.display = 'inline' : "";
  sessionLabel.innerText = value;
  timeLeft.innerText = value < 10 ? `0${value}:00` : `${value}:00`;
}

function breakFormatter(value) {
  breakValue = value;
  breakLabel.innerText = value;
}

function display(text, color) {
  timerLabel.innerText = text;
  timerLabel.style.color = color;
}

sessionFormatter(25);
breakFormatter(5);

/*** Main Timer Class ***/
class Timer {
  constructor() {
    this.running = false;
    this.audio = true;
    this.sessionTime = sessionValue * 60;
    this.breakTime = breakValue * 60;
  }

  play() {
    this.running = true;
    display('Session Ongoing', 'seagreen');
  }

  pause() {
    this.running = false;
    display('Session Paused', '#F8A145');
  }

  reset() {
    this.running = false;
    this.sessionTime = 1500;
    this.breakTime = 600;
    display('Begin Session', '#F8A145');
    beep.pause();
  }

  run() {
    let formatTime = time => {
      var mins = Math.floor((time % 3600) / 60);
      var secs = time % 60;
      timeLeft.innerText = time == 3600 ? "60:00" : `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`;
    }

    setInterval(() => {
      if (this.running) {
        this.sessionTime > 0 ? this.sessionTime -= 1 : "";
        formatTime(this.sessionTime);
        if (this.sessionTime == 0) {
          this.audio ? beep.play() : beep.pause();
          formatTime(this.breakTime);
          display('Break Begins', 'firebrick');
          this.breakTime > 0 ? this.breakTime -= 1 : "";
          if (this.breakTime == 0) {
            timerLabel.style.fontStyle = 'italic';
            timerLabel.style.fontWeight = 'bolder';
            display('Timer & Break Elapsed', '#E31C25');
            this.running = false;
          }
        }
      }
    }, 1000)
  }

  enableAudio() {
    this.audio = true;
  }
  
  disableAudio() {
    this.audio = false;
  }
  
  increaseSession() {
    this.sessionTime <= 3540 ? this.sessionTime += 60 : "";
  }

  decreaseSession() {
    this.sessionTime >= 120 ? this.sessionTime -= 60 : "";
  }

  increaseBreak() {
    this.breakTime <= 3600 ? this.breakTime += 60 : "";
  }

  decreaseBreak() {
    this.breakTime >= 120 ? this.breakTime -= 60 : "";
  }
}

let timer = new Timer();

document.addEventListener('DOMContentLoaded', function() {
  timer.run();
});

handlePlay.addEventListener('click', function() {
  toggleClass(this, 'fa-play', 'fa-pause');
  modifyAttr(elems, s => s.setAttribute("disabled", true));
  this.classList.contains('fa-play') ? timer.pause() : timer.play();
});

reset.addEventListener('click', function() {
  timer.reset();
  sessionFormatter(25);
  breakFormatter(5);
  handlePlay.classList.add("fa-play");
  modifyAttr(elems, r => r.removeAttribute("disabled"));
  hide.style.display = "none";
});

sessionDecrement.addEventListener('click', function() {
  timer.decreaseSession();
  sessionValue > 1 ? sessionValue -= 1 : "";
  sessionFormatter(sessionValue);
});

sessionIncrement.addEventListener('click', function() {
  timer.increaseSession();
  sessionValue >= 0 && sessionValue < 60 ? sessionValue += 1 : "";
  sessionFormatter(sessionValue);
})

breakDecrement.addEventListener('click', function() {
  breakValue > 1 ? breakValue -= 1 : "";
  timer.decreaseBreak();
  breakFormatter(breakValue);
});

breakIncrement.addEventListener('click', function() {
  breakValue > 0 && breakValue < 60 ? breakValue += 1 : ""
  timer.increaseBreak();
  breakFormatter(breakValue);
});

changeBell.addEventListener('click', function() {
  toggleClass(this, 'fa-bell-slash', 'fa-bell');
  this.classList.contains('fa-bell-slash') ? timer.enableAudio() : "";
});
