let patterns = getPatterns();

const wrapper = document.querySelector(".wrapper");
const savePatternButton = document.querySelector('.save');
const h_phrase_el = document.getElementById("h_phrase");
const v_phrase_el = document.getElementById("v_phrase");
const patternViewer = document.getElementById("pattern");
const patternsList = document.querySelector('.patterns-list');

let horizontal_content = h_phrase_el.innerHTML;
const horizontal_length = horizontal_content.length;
let vertical_content = v_phrase_el.innerHTML;
const vertical_length = vertical_content.length;

// - - - - - - - - - - - - - - -
// Utilities
// - - - - - - - - - - - - - - -
function createEl(element, class_name, content) {
  const el = document.createElement(element);
  el.className = class_name;
  if (content) {
    el.appendChild(content);
  }

  return el;
}

function useCustomProperty(name) {
  // Get the value of the custom property
  const prop = getComputedStyle(document.documentElement).getPropertyValue(name);
  return prop;
}

(function () { // Konami Code listener (↑ ↑ ↓ ↓ ← → ← → B A)
  const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let konamiSequence = [];
  document.addEventListener('keydown', (event) => {
    konamiSequence.push(event.key);
    if (konamiSequence.length > konamiCode.length) {
      konamiSequence.shift();
    }
    if (konamiSequence.toString() === konamiCode.toString()) {
      wrapper.classList.add('fancy');
      console.log("+ - - - - - - - +");
      console.log("|  K O N A M I  |");
      console.log("+ - - - - - - - +");
      konamiSequence = [];
    }
  });
})();

// - - - - - - - - - - - - - - -
// Character handling
// - - - - - - - - - - - - - - -
function characterType(character) {
  if (/[aeiou]/iu.test(character)) return 'vowel';
  if (/[bcdfghjklmnpqrstvwxyz]/i.test(character)) return 'consonant';
  if (/\s/.test(character)) return 'space';
  if (/[02468]/.test(character)) return 'even_number';
  if (/[13579]/.test(character)) return 'odd_number';
  if (/[\.,!?\-\—;:'"(){}[\]]/.test(character)) return 'punctuation';
  if (/\$|€|£|¥|₹/.test(character)) return 'currency';
  if (/[\+\-\*/=<>|%]/.test(character)) return 'math_symbol';
  return 'unknown';
}

function isLine(type) {
  let line = false;

  const type_with_lines = ['vowel', 'even_number', 'space', 'math_symbol'];

  if (type_with_lines.includes(type)) {
    line = true;
  } else {
    line = false;
  }
  return line;
}

function readLetters(string) {
  const array = []
  const stringLength = string.length;
  for (let i = 0; i < string.length; i++) {
    const char = string.charAt(i);
    const type = characterType(char);
    const line = isLine(type);

    array.push(line);
  }

  return [stringLength, array];
}

function invertLines(lines) {
  const inverted_lines = []
  for (let i = 0; i < lines.length; i++) {
    let line;
    if (lines[i] === true) {
      line = false;
    } else {
      line = true;
    }
    inverted_lines.push(line);
  }

  return inverted_lines;
}

// - - - - - - - - - - - - - - -
// Render functions
// - - - - - - - - - - - - - - -
function generateBlocks(horizontal_string, vertical_string) {
  const h_letters = readLetters(horizontal_string);
  const v_letters = readLetters(vertical_string);
  const h_length = h_letters[0];
  const v_length = v_letters[0];
  const h_lines_a = h_letters[1];
  const h_lines_b = invertLines(h_lines_a);
  const v_lines_a = v_letters[1];
  const v_lines_b = invertLines(v_lines_a);

  const pattern_width = h_length;
  const pattern_height = v_length;

  let matrix = [];

  for (let i = 0; i < pattern_height; i++) {
    if (i % 2 === 0) {
      for (let j = 0; j < pattern_width; j++) {
        if (j % 2 === 0) {
          // Pair h_lines_a with v_lines_a
          matrix.push([h_lines_a[j], v_lines_a[i]]);
        } else {
          // Pair h_lines_a with v_lines_b
          matrix.push([h_lines_a[j], v_lines_b[i]]);
        }
      }
    } else {
      for (let j = 0; j < pattern_width; j++) {
        if (j % 2 === 0) {
          // Pair h_lines_b with v_lines_a
          matrix.push([h_lines_b[j], v_lines_a[i]]);
        } else {
          // Pair h_lines_b with v_lines_b
          matrix.push([h_lines_b[j], v_lines_b[i]]);
        }
      }
    }
  }

  let blocks = []

  for (let i = 0; i < matrix.length; i++) {
    let block = document.createElement('div');
    block.className = 'block';
    const h_value = matrix[i][0];
    const v_value = matrix[i][1];
    if (h_value === true) {
      block.classList.add('h-on');
      block.appendChild(createEl('div', 'h-line'));
    }
    if (v_value === true) {
      block.classList.add('v-on');
      block.appendChild(createEl('div', 'v-line'));
    }
    blocks.push(block);
  }

  return blocks;
}

// function drawPattern(h_content, v_content) {

//   patternViewer.innerHTML = '';
//   const h_phrase = h_content || "";
//   const v_phrase = v_content || "";

//   const pattern_width = h_phrase.length
//   const pattern_height = v_phrase.length

//   const size = useCustomProperty('--box-size');

//   patternViewer.style.width = `calc(${pattern_width} * ${size})`;
//   patternViewer.style.height = `calc(${pattern_height} * ${size})`;

//   const blocks = Array.from(generateBlocks(h_phrase, v_phrase));
//   const blocks_html = blocks.map(node => node.outerHTML).join('');
//   const patternContainer = createEl("div", "pattern-container");
//   // patternViewer.innerHTML += patternContainer;
//   patternContainer.innerHTML = blocks_html;

//   return patternContainer;
// };

function drawPattern2(h_phrase, v_phrase) {
  let h = h_phrase || "";
  let v = v_phrase || "";
  // console.log(h);
  // console.log(v);

  const patternContainer = createEl("div", "pattern-container");
  const pattern_width = h.length;
  const pattern_height = v.length;

  const size = useCustomProperty('--box-size');

  patternContainer.style.width = `calc(${pattern_width} * ${size})`;
  patternContainer.style.height = `calc(${pattern_height} * ${size})`;

  const blocks = Array.from(generateBlocks(h, v));
  const blocks_html = blocks.map(node => node.outerHTML).join('');
  patternContainer.innerHTML += blocks_html;

  return patternContainer;
};

function renderMainPattern() {
  horizontal_content = h_phrase_el.innerHTML;
  vertical_content = v_phrase_el.innerHTML;
  patternViewer.innerHTML = drawPattern2(horizontal_content, vertical_content).outerHTML;
}

function getPatterns() {
  const storedPatterns = JSON.parse(localStorage.getItem('patterns')) || [];
  return storedPatterns;
}

function savePattern(e) {
  const storedPatterns = getPatterns();
  console.log("save button pressed");
  e.preventDefault();
  const h = h_phrase_el.innerHTML || "";
  const v = v_phrase_el.innerHTML || "";
  const patternItem = { h, v };

  storedPatterns.push(patternItem);
  populateList(storedPatterns, patternsList);
  localStorage.setItem('patterns', JSON.stringify(storedPatterns));
}

function removePattern(event) {
  console.log("remove button pressed");
  event.preventDefault();
  const el = event.target.closest(".pattern-list-item");
  const index = el.dataset.index;

  const patternsArray = JSON.parse(localStorage.getItem('patterns'));
  patternsArray.splice(index, 1);
  localStorage.setItem('patterns', JSON.stringify(patternsArray));
  populateList(patternsArray, patternsList);
}

function populateList(patterns = [], patternsList) {
  console.log(patterns);
  let renderPatterns = [];
  patternsList.innerHTML = '';
  if (patterns.length > 0) {
    patternsList.innerHTML = patterns.map((pattern, i) => {
      // console.log(pattern);
      // console.log("- - - - ");
      const h_content = pattern.h_phrase;
      const v_content = pattern.v_phrase;
      const patternListItem = `
        <div class="pattern-list-item" data-index=${i}>
          <div class="saved-pattern-wrapper">
            <div class="h-phrase">${h_content}</div>
            <div class="v-phrase">${v_content}</div>
            <button class="button remove">remove</div>
            </div>
            </div>
            `
            // <div class="saved-pattern" id="${i}">${drawPattern2(h_content, v_content).outerHTML}<div>
      console.log("- - - - - - - - ");
      console.log(patternListItem);
      console.log("- - - - - - - - ");
      return patternListItem;
    }).join('');
  }
}

// savePatternButton.addEventListener('click', savePattern);
document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('remove')) {
    removePattern(event);
  };
  if (event.target.classList.contains('save')) {
    savePattern(event);
  };
});

(function () {
  renderMainPattern();
  populateList(patterns, patternsList);
  h_phrase_el.addEventListener('keyup', (event) => {
    console.log(event.key);
    renderMainPattern();
  });
  v_phrase_el.addEventListener('keyup', (event) => {
    console.log(event.key);
    renderMainPattern();
  });
})();
