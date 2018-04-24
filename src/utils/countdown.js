const getTimeRemaining = (endtime) => {
  const t = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((t / 1000) % 60);
  const minutes = Math.floor((t / 1000 / 60) % 60);
  const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
};

const initializeClock = (id, endtime) => {
  let clock = document.getElementById(id);
  let daysSpan = clock.querySelector('.days');
  let hoursSpan = clock.querySelector('.hours');
  let minutesSpan = clock.querySelector('.minutes');
  let secondsSpan = clock.querySelector('.seconds');

  const updateClock = () => {
    let t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = (`0${  t.hours}`).slice(-2);
    minutesSpan.innerHTML = (`0${  t.minutes}`).slice(-2);
    secondsSpan.innerHTML = (`0${  t.seconds}`).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  };

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
};


const start = () => {
  const deadline = new Date(Date.parse(new Date()) + 25 * 24 * 60 * 60 * 1000);
  initializeClock('time', deadline);
};

export default start;
