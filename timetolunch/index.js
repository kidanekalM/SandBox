
const nowTimestamp = Date.now();
const nowDate = new Date(nowTimestamp);
const minutes = nowDate.getMinutes();
const lunchTime = new Date(nowDate);
console.log(lunchTime);
nowDate.getHours() >= 12 ? lunchTime.setHours(17, 0, 0) : lunchTime.setHours(12, 0, 0);
console.log(lunchTime);
secondsUntilOut = (lunchTime - nowTimestamp ) / 1000 ;

 document.getElementById('seconds').innerHTML = secondsUntilOut;

 setInterval(()=>{
    secondsUntilOut--;
    document.getElementById('seconds').innerHTML = secondsUntilOut;
    document.getElementById('minutes').innerHTML = Math.ceil(secondsUntilOut / 60);
    document.getElementById('hours').innerHTML = Math.ceil(secondsUntilOut / 3600);
}, 1000)