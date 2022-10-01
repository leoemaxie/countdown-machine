const getElem = id => document.getElementById(id);

class Timer {
  constructor() {
    this.handlePlay = getElem('start_stop');
    this.sessionLabel = getElem('session-length');
    this.breakLabel = getElem('break-length');
    this.sessionDecrement = getElem('session-decrement');
    this.sessionIncrement = getElem('session-increment');
    this.reset = getElem('reset');
    this.breakIncrement = getElem('break-increment');
    this.breakDecrement = getElem('break-decrement');
    this.changeBell = getElem('change-bell');
    this.timeLeft = getElem('time-left');
    this.beep = getElem('beep');
    this.timerLabel = getElem('timer-label');
    this.hide = getElem('hide');
    this.sessionValue = Number(sessionLabel.getAttribute('data-value'));
    this.breakValue = Number(breakLabel.getAttribute('data-value'));
    this.running = true;
  }

  start() {
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  reset() {
    this.running = false;
    this.sessionValue = 0;
  }

  run() {
      console.log(this.sessionValue)
    if (this.running) {
      var time = this.sessionValue * 3600;
      setInterval(() => {
        this.time--;
        this.timeLeft.innerText = sessionValue % 60 ;
      }, 1000);
    }
  }
}
