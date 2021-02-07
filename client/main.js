const connectionManager = new ConnectionManager(processMessage);

const readyCheck = document.getElementById('ready-check');
const chatInput = document.getElementById('chat-input');
const lobbyInput = document.getElementById('lobby-input');
const lobbyDisplay = document.getElementById('lobby-display');

const locationsList = ["✈️💺 Airport",
    "🏦💰 Bank",
    "🎰💵 Casino",
    "🎞🍿 Cinema",
    "🦸🦹 Cosplay Convention",
    "🛳🌊 Cruise Ship",
    "⚽️🏟 Football Stadium",
    "🌳🏕 Forest Camp",
    "🏪🛒 Grocery Store",
    "🏥🧑‍⚕️ Hospital",
    "🏨🛏 Hotel",
    "🌕🧑‍🚀 Moon Colony",
    "🏛🖼 Museum",
    "🏟🎸 Rock Concert",
    "🚄🛤 Train Station",
    "🏫🎓 University"
];

const extendedLocationsList = ["🏝🥥 Desert Island",
    "⛰🥾 Mountain Hike",
    "🏤📮 Post Office",
    "🍽👩‍🍳 Restaurant"];

const eventsBox = document.getElementById('events');

let intervalId;

function appendText(text, author, color) {
    let newLine = document.createElement('li');
    if (author) {
        let authorElem = document.createElement('b');
        authorElem.innerText = `${author}: `;
        newLine.appendChild(authorElem);
    }

    let textElem = document.createElement('span');
    textElem.innerText = text;
    newLine.appendChild(textElem);

    if (color) {
        newLine.style.color = color;
    }

    eventsBox.appendChild(newLine);
    if (eventsBox.childNodes.length > 11) {
        eventsBox.removeChild(eventsBox.childNodes[0]);
    }
}

function clearChat() {
    for (let i = eventsBox.childNodes.length - 1; i >= 0; i--) {
        eventsBox.removeChild(eventsBox.childNodes[0]);
    }
}

function showElement(elementId, show) {
    let elem = document.getElementById(elementId);
    if (show) {
        elem.style.display = 'block';
    } else {
        elem.style.display = 'none';
    }
}

function showHide(elementId) {
    let elem = document.getElementById(elementId);
    if (elem.style.display === 'none') {
        elem.style.display = 'block';
    } else {
        elem.style.display = 'none';
    }
}

function processMessage(type, data) {
    if (type === 'chat-event') {
        appendText(data.message, data.author, data.color);
    } else if (type === 'session-broadcast') {
        displayPeers(data.peers.clients);
    } else if (type === 'start-game') {
        startGame(data);
    } else if (type === 'session-created') {
        //TODO replace window.location.hash with ?code=
        window.location.hash = data.sessionId;
        lobbyDisplay.value = data.sessionId;
        lobbyDisplay.style.width = `${lobbyDisplay.value.length + 2}rem`;
    }
}

function startGame(data) {
    window.scrollTo(0, 0);
    clearChat();
    readyCheck.checked = false;
    resetClickableElements();

    startTimer(5 * 60, progressBar);

    appendText('Game started');
    if (data.spy) {
        appendText(`🕵️ You are the spy, try to guess the current location`, null, 'red');
    } else {
        appendText(`😇 You are not the spy, the location is ${data.location}`, null, 'blue');
    }
    appendText(`First player: ${data.first}`);
}

function displayPeers(clients) {
    let peersList = document.getElementById('peers-list');
    peersList.innerHTML = '';
    clients.map(client => {
        let newLine = document.createElement('li');
        newLine.classList.add('clickable');
        newLine.addEventListener('click', event => addRemoveClass(event.target, 'strike'));
        let ready = client.ready ? ' ✅' : '';
        newLine.innerText = `${client.name}${ready}`;
        return newLine;
    }).forEach(line => peersList.appendChild(line));
}

function printError(content) {
    let errorBox = document.getElementById("error");
    errorBox.innerText = content;
    errorBox.style.display = "block";
}

function resetErrors() {
    let errorBox = document.getElementById("error");
    errorBox.style.display = "none";
    errorBox.innerHTML = "";
}

function connectionOpened() {
    joinLobby();
}

function connectionClosed() {
    resetAll();
    printError(`Connection to server closed`);
}

const lobbyElements = ['chat-wrapper', 'players-wrapper'];
function resetAll() {
    resetErrors();
    clearChat();
    showElement('connect-wrapper', true);
    lobbyElements.forEach(elem => showElement(elem, false));
    readyCheck.checked = false;
    resetClickableElements();
    clearInterval(intervalId);

    window.scrollTo(0, 0);
}

function resetClickableElements() {
    document.querySelectorAll('.strike').forEach(elem => elem.classList.remove('strike'));
}

function joinLobby() {
    resetErrors();

    showElement('connect-wrapper', false);
    lobbyElements.forEach(elem => showElement(elem, true));

    lobbyDisplay.value = connectionManager.sessionId;
    lobbyDisplay.style.width = `${lobbyDisplay.value.length}rem`;
}

let windowHash = window.location.hash.split('#')[1];
if (windowHash) {
    if (windowHash.length > 8) {
        windowHash = windowHash.substring(0, 8);
    }
    lobbyInput.value = windowHash.toUpperCase();
}

function addRemoveClass(element, cssClass) {
    if (element.classList.contains(cssClass)) {
        element.classList.remove(cssClass);
    } else {
        element.classList.add(cssClass);
    }
}

// Listeners

document.getElementById('connect-form').addEventListener('submit', event => {
    event.preventDefault();

    let playerName = document.getElementById('name-input');
    connectionManager.connect(playerName.value, lobbyInput.value, connectionOpened, connectionClosed);
});

const createLobbyButton = document.getElementById('create-lobby-button');
function setLobbyButtonText() {
    if (lobbyInput.value && lobbyInput.value.length > 0) {
        createLobbyButton.innerText = '🔌 Join Lobby';
    } else {
        createLobbyButton.innerText = '🏠 Create Lobby';
    }
}
setLobbyButtonText();
lobbyInput.addEventListener('input', () => {
    lobbyInput.value = lobbyInput.value.toUpperCase();
    setLobbyButtonText();
});

document.getElementById('talk-form').addEventListener('submit', event => {
    event.preventDefault();
    connectionManager.send('chat-event', { message: chatInput.value });
    chatInput.value = '';
});

document.getElementById('rules-button').addEventListener('click', event => showHide('instructions'));

readyCheck.addEventListener('change', event => connectionManager.send('player-ready', { ready: event.target.checked }));

document.getElementById('new-game-form').addEventListener('submit', event => {
    resetErrors();
    event.preventDefault();
    if (readyCheck.checked) {
        connectionManager.send('start-game');
    } else {
        printError("You are not ready");
    }
});

let locationsListElement = document.getElementById('locations-list');
locationsList.map(locationName => {
    let li = document.createElement("li");
    li.innerHTML = locationName;
    li.classList.add('clickable', 'list-group-item', 'py-1');
    li.addEventListener('click', event => addRemoveClass(event.target, 'strike'));
    return li;
}).forEach(li => {
    locationsListElement.append(li);
});

const progressBar = document.getElementById('progress-bar');
function startTimer(duration, display) {
    clearInterval(intervalId);
    var timer = duration;
    setTimerDisplay(timer, duration, display);
    intervalId = setInterval(function () {
        timer--;
        setTimerDisplay(timer, duration, display);
        if (timer < 0) {
            display.textContent = "🔔 Time's up! Who is the Spy?";
            clearInterval(intervalId);
        }
    }, 1000);
}

function setTimerDisplay(timer, totalDuration, display) {
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? ("0" + minutes) : minutes;
    seconds = seconds < 10 ? ("0" + seconds) : seconds;

    display.textContent = `⏱ ${minutes}:${seconds}`;
    let progress = timer / totalDuration * 100;
    display.style = `width: ${progress}%;`;
    display.setAttribute('aria-valuenow', Math.round(progress));
}

document.getElementById('leave-lobby-button')
    .addEventListener('click', event => connectionManager.disconnect());

document.getElementById('chat-box').addEventListener('click', event => chatInput.focus());
