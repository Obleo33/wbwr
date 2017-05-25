const { remote } = require('electron');
const $ = require('jquery');

const testsring = `CSS Grid layout brings a two-dimensional layout tool to the web, with the ability to lay out items in rows and columns. CSS Grid can be used to achieve many different layouts. It excels at dividing a page into major regions, or defining the relationship in terms of size, position, and layer, between parts of a control built from HTML primitives. Like tables, grid layout enables an author to align elements into columns and rows. However, unlike tables, grid layout doesn't have content structure, therefore enabling a wide variety of layouts not possible in tables. For example, a grid container's child elements could position themselves so they actually overlap and layer, similar to CSS positioned elements.`

let WPM = 400;
const WPM_MAX = 1000;
const WPM_MIN = 50;

let PAUSED = true;

const msSpeed = () => {
  return ((60 / WPM) * 1000);
};


const splitter = (string) => {
  const stringRegExp = new RegExp(/[\n\s]/);
  const wordObjArray = string.split(stringRegExp);

  return wordObjArray.map((word) => {
    const punctuationRegExp = new RegExp(/[.,\/#!$%\^&\*;:{}=\-_`~()]/);
    const result = { word, punctuation: false };
    if (word.match(punctuationRegExp)) {
      // change to delay time.
      result.punctuation = true;
    }
    return result;
  });
};

const textFromMenu = remote.getCurrentWindow().readerText;
const wordObjArray = splitter(textFromMenu || testsring);

let currentWordIndex = 0;
const run = () => {
  if (!PAUSED) {
    if(currentWordIndex < wordObjArray.length - 1) {
      currentWordIndex++;
      const wordObject = wordObjArray[currentWordIndex];

      if (wordObjArray[currentWordIndex].punctuation) {
        setTimeout(() => { run() }, msSpeed() * 2);
      } else {
        setTimeout(() => { run() }, msSpeed());
      }
    } else {
      window.close();
    }
    updateDisplay();
  }
}

const updateDisplay = () => {
  const past = wordObjArray.slice(0, currentWordIndex).map(obj => obj.word).join(' ');
  const future = wordObjArray.slice(currentWordIndex + 1, wordObjArray.length - 1).map(obj => obj.word).join(' ');

  $('.viewer').empty().append(wordObjArray[currentWordIndex].word);
  $('.scrolling-past').empty().append(past);
  $('.scrolling-current').empty().append(wordObjArray[currentWordIndex].word);
  $('.scrolling-future').empty().append(future);
  $('.read-count').empty().append(currentWordIndex + 1);
  $('.remaining-count').empty().append(wordObjArray.length - currentWordIndex);
};

const setWPM = () => {
  $('.wpm').empty().append(WPM);
};

const playPause = () => {
  PAUSED = !PAUSED;
  !PAUSED && run();
};

const faster = () => {
  if (WPM < WPM_MAX) {
    WPM += 10;
    setWPM();
  }
};

const slower = () => {
  if (WPM > WPM_MIN) {
    WPM -= 10;
    setWPM();
  }
};

const next = () => {
  PAUSED = true;
  currentWordIndex++;
  updateDisplay();
};

const back = () => {
  PAUSED = true;
  currentWordIndex--;
  updateDisplay();
};

$('html').on('keydown', (e) => {
  switch (e.keyCode) {
    case 32:
      e.preventDefault();
      playPause();
      break;
    case 40:
      slower();
      break;
    case 38:
      faster();
      break;
    case 37:
      back();
      break;
    case 39:
      next();
      break;
    default:
  }
});

$('#play-pause-button').on('click', () => {
  playPause();
});

$('#faster-button').on('click', () => {
  faster();
});

$('#slower-button').on('click', () => {
  slower();
});

$('#last-button').on('click', () => {
  back();
});

$('#next-button').on('click', () => {
  next();
});

setWPM();
updateDisplay();
