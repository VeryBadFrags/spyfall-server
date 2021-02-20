import { addRemoveClass, resetClickableElements } from "/utils.js";


let intervalId;

let windowHash = window.location.hash.split("#")[1];
if (windowHash) {
  if (windowHash.length > 8) {
    windowHash = windowHash.substring(0, 8);
  }
  lobbyInput.value = windowHash.toUpperCase();
}

// Listeners

document.getElementById("connect-form").addEventListener("submit", (event) => {
  event.preventDefault();

  let playerName = document.getElementById("name-input");
  connectionManager.connect(
    playerName.value,
    lobbyInput.value,
    connectionOpened,
    connectionClosed
  );
});

document
  .getElementById("rules-button")
  .addEventListener("click", () => showHide("instructions"));

readyCheck.addEventListener("change", (event) =>
  connectionManager.send("player-ready", { ready: event.target.checked })
);

document.getElementById("new-game-form").addEventListener("submit", (event) => {
  resetErrors();
  event.preventDefault();
  if (readyCheck.checked) {
    connectionManager.send("start-game");
  } else {
    printError("You are not ready");
  }
});

let locationsListElement = document.getElementById("locations-list");
locationsList
  .map((locationName) => {
    let li = document.createElement("li");
    li.innerHTML = locationName;
    li.classList.add("clickable", "list-group-item", "py-1");
    li.addEventListener("click", (event) =>
      addRemoveClass(event.target, "strike")
    );
    return li;
  })
  .forEach((li) => {
    locationsListElement.append(li);
  });

const progressBar = document.getElementById("progress-bar");
function startTimer(duration, display) {
  clearInterval(intervalId);
  var timer = duration;
  setTimerDisplay(timer, duration, display);
  intervalId = setInterval(function () {
    timer--;
    setTimerDisplay(timer, duration, display);
    if (timer <= 0) {
      display.textContent = "🔔 Time's up! Who is the Spy?";
      display.setAttribute("aria-valuenow", 0);
      display.style = `width: 100%;`;
      clearInterval(intervalId);
    }
  }, 1000);
}

function setTimerDisplay(timer, totalDuration, display) {
  let minutes = parseInt(timer / 60, 10);
  let seconds = parseInt(timer % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  display.textContent = `⏱ ${minutes}:${seconds}`;
  let progress = (timer / totalDuration) * 100;
  display.style = `width: ${progress}%;`;
  display.setAttribute("aria-valuenow", Math.round(progress));
}

document
  .getElementById("chat-box")
  .addEventListener("click", () => chatInput.focus());
