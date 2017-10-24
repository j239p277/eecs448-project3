// filename    : time.js
// description : Timeline helper functions
// last update : 10 23 2017

let game_seconds = 0;
let seconds = 0;
// let minutes = 5; See main.js

function startSeconds() {
  setInterval(function(){
    if(seconds % 60 === 0) {
      seconds = 0;
      minutes--;
    }
    if(minutes < 0 && seconds === 0) {
      window.location.reload();
    }else {
      calculated_sec = 59 - seconds;
      if(calculated_sec > 9) {
        document.getElementsByClassName("time")[0].innerHTML = minutes + ":" + calculated_sec;
      }else {
        document.getElementsByClassName("time")[0].innerHTML = minutes + ":0" + calculated_sec;
      }
    }
    game_seconds++;
    seconds++;
  }, 1000);
}

function getScore() {
  document.getElementsByClassName("score")[0].innerHTML = score_red;
  document.getElementsByClassName("score")[1].innerHTML = score_blue;
}
