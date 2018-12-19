// Initializing and declaring global variables
let iconList = ['fa fa-diamond', 'fa fa-paper-plane', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'];
iconList =  [...iconList, ...iconList];
let flippedCards = []; // used to ensure that a max of two cards are flipped
let numMoves = 0;
let matches = 0;
let numStars = 3;
let seconds = 0;
let timerInterval;
let minutes;
let remSeconds;
let starList = ['fa fa-star', 'fa fa-star', 'fa fa-star'];

// Initializing DOM variables
const deck = document.querySelector('.deck');   //grabbing deck
const moves = document.querySelector('.moves');
const restart = document.querySelector('.restart');
const stars = document.querySelector('.stars');
const timer = document.querySelector('.timer');
const scorePanel = document.querySelector('.score-panel');



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  // temporaryValue and randomIndex is being declared but not given a value.
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    // A randomIndex is being chosen that is < the currentIndex
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Deals cards
function deal() {
  updateStars();
  updateTimer('00:00');
  moves.innerHTML = numMoves;
  const cards = shuffle(iconList);
  // Creating the cards and places them on deck
  for (const iconType of cards) {
    const card = document.createElement('li');
    card.className = 'card';
    // On click the card will be revealed and will check for a match with the next card clicked
    card.addEventListener('click', function () {
      // Only 2 cards can be flipped at once
      // You can't flip a card that already has a class of 'match' or 'flipped'
      if (flippedCards.length < 2 && !card.classList.contains('match') && !card.classList.contains('flipped')) {
        flippedCards.push(card);
        // First click will start timer as well
        if (flippedCards.length === 1 && numMoves === 0){
          startTimer();
        }
        card.classList.add('flipped');
        checkForMatch();
      }
    });

    const icon = document.createElement('i');
    icon.className = iconType;

    card.appendChild(icon);
    deck.appendChild(card);
  }
}

function startTimer() {
  timerInterval = setInterval(function () {
    if (matches < 8) {
      seconds++;
      const formattedTime = formatTime(seconds);
      updateTimer(formattedTime);
    }
  }, 1000);
}

// If two cards have been flipped it will check for matching inner html
// Also determines the number of stars based off he numbers of moves and will redraw stars accordingly
function checkForMatch() {
  if (flippedCards.length === 2) {
    numMoves += 1;
    moves.innerHTML = numMoves;

    if (numMoves === 18) {
      starList[2] = 'fa fa-star-o';
      redrawStars();
      numStars = 2;
    }
    else if (numMoves === 30) {
      starList[1] = 'fa fa-star-o';
      redrawStars();
      numStars = 1;
    }
    else if (numMoves === 45) {
      starList[0] = 'fa fa-star-o';
      redrawStars();
      numStars = 0;
    }

    const [firstCard, secondCard] = flippedCards;
    if (firstCard.innerHTML === secondCard.innerHTML) {
      match(firstCard, secondCard);
    } else {
      noMatch(firstCard, secondCard);
    }
  }
}

// If the cards are a match they will be given the class and locked Open
function match(a,b) {
  matches += 1;
  a.classList.add('match');
  b.classList.add('match');
  // will reset flippedCards in 500ms
  setTimeout(function () {
    flippedCards = [];
  }, 500);
  // If all cards are matched, the board will clear and a message will appear
  if (matches === 8) {
    setTimeout(function () {
      clearBoard();
      scorePanel.classList.add('hide');
      deck.classList.add('blank');
      // Creating elements to contain the message
      const replayCard = document.createElement('element');
      const results = document.createElement('div')
      const replayButton = document.createElement('button');

      replayButton.innerHTML = `<b>PLAY AGAIN!<b>`;
      replayCard.innerHTML = `<p>Congratulation! You won!</p>`;

      if (seconds < 60) {
        results.innerHTML = `<p>You finished in ${seconds} second${seconds !== 1 ? 's' : ''}
        with ${numMoves} moves and ${numStars} star${numStars !== 1 ? 's' : ''}.</p>
        <p>Woooooo!</p>`;
      }
      else {
        results.innerHTML = `<p>You finished in ${minutes} minute${minutes !== 1 ? 's' : ''}
        and ${remSeconds} second${remSeconds !== 1 ? 's' : ''} with ${numMoves} moves
        and ${numStars} star${numStars !== 1 ? 's' : ''}.</p>
        <p>Woooooo!</p>`;
      }

      deck.appendChild(replayCard);
      replayCard.appendChild(results);
      replayCard.appendChild(replayButton);
      // On click the replay button will reset the game back to beginning
      replayCard.addEventListener('click', redo);

      replayCard.className = 'replay';
    }, 1000);
  }
}

// If cards dont match they will be given a class of wrong and no longer diplayed
function noMatch(a,b) {
  a.classList.add('wrong');
  b.classList.add('wrong');
  // will show for 500ms
  setTimeout(function () {
    a.classList.remove('wrong', 'flipped');
    b.classList.remove('wrong', 'flipped');
    flippedCards = [];
  }, 500);

}


// restarts everything back to the beginning
 function redo (){
   // reinitializing the values
   numMoves = 0;
   matches = 0;
   seconds = 0;
   flippedCards = [];
   // removing the classes that hid everything
   deck.classList.remove('blank');
   scorePanel.classList.remove('hide');

   clearBoard();
   resetStars();
   deal();
   // Stops time interval
   clearInterval(timerInterval);
 }

 // clears all cards off the deck
  function clearBoard () {
    while (deck.firstChild) {
      deck.removeChild(deck.firstChild);
    }
  }


// Functions for creating stars
// Creating an element for the staricons and giving it a class to determine
// if its a full star or open star
function updateStars() {
  for (const starType of starList) {
    const starBox = document.createElement('li');
    const star = document.createElement('i');
    star.className = starType;
    starBox.appendChild(star);
    stars.appendChild(starBox);
  }
}

// removes all stars
function removeStarsFromDOM() {
  while (stars.firstChild) {
    stars.removeChild(stars.firstChild);
  }
}

// removes the current stars and redraws the new ones
function redrawStars () {
  removeStarsFromDOM();
  updateStars();
}

// reinitializing the stars
function resetStars () {
  removeStarsFromDOM();
  starList = ['fa fa-star', 'fa fa-star', 'fa fa-star'];
}


// Functions for setting up timer
// Converting seconds to minutes and remseconds to them format them in a stopwatch manner
function formatTime() {
  const timerBox = document.createElement('div');
  timer.appendChild(timerBox);
  minutes = Math.floor(seconds / 60);
  remSeconds = seconds - (minutes * 60);
  return `${formatNum(minutes)}:${formatNum(remSeconds)}`;
}

// Formats the numbers so it will display as two charecters always
function formatNum(num) {
  if (num >= 10) {
    return num;
  } else {
    return `0${num}`;
  }
}

// Removes the old time and replaces with new every second
function updateTimer(time) {
  while (timer.firstChild) {
    timer.removeChild(timer.firstChild);
  }
  timer.innerHTML = time;
}


// calls the redo function on click
restart.addEventListener('click', redo);

// runs when document is ready
document.addEventListener('DOMContentLoaded', function () {
  deal();
});
