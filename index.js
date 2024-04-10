const currentUrl = window.location.pathname;
const patterns = JSON.parse(localStorage.getItem('patterns')) || [];

const patternsList = document.querySelector('.patterns-list');

let wrapper;
let savePatternButton;
let h_sentence_el;
let horizontal_content;
let horizontal_length;
let v_sentence_el;
let vertical_content;
let vertical_length;
let patternViewer;
let savedPatternsLink;

if (currentUrl === "/") {
  wrapper = document.querySelector(".wrapper");
  savePatternButton = document.querySelector('.save');
  h_sentence_el = document.getElementById("h_sentence");
  horizontal_content = h_sentence_el.innerHTML;
  horizontal_length = horizontal_content.length;
  v_sentence_el = document.getElementById("v_sentence");
  vertical_content = v_sentence_el.innerHTML;
  vertical_length = vertical_content.length;
  patternViewer = document.getElementById("pattern");
}

// if (currentUrl !== "/") {
//   savedPatternsLink = document.querySelector('.saved-patterns-link');
// }

// function characterType(character) {
//   if (/[aeiou]/ui.test(character)) return 'vowel';
//   if (/(?![aeiou])[a-z]/i.test(character)) return 'consonant';
//   if (/\s/u.test(character)) return 'space'; // Simplified space check for broader compatibility
//   if (/[02468]/u.test(character)) return 'even_number';
//   if (/[13579]/u.test(character)) return 'odd_number';
//   if (/\p{Emoji_Presentation}/u.test(character)) return 'emoji';
//   if (/\p{General_Category=Punctuation}/u.test(character)) return 'punctuation';
//   if (/\p{Currency_Symbol}/u.test(character)) return 'currency';
//   if (/[\p{Ps}\p{Pe}]/u.test(character)) return 'parenthesis';
//   if (/\p{General_Category=Math_Symbol}/u.test(character)) return 'math_symbol';
//   if (/\p{General_Category=Letterlike_Symbols}/u.test(character)) return 'letterlike_symbol';
//   if (/\p{Script=Latin}/u.test(character)) return 'latin';
//   if (/\p{Extended_Pictographic}/u.test(character)) return 'pictograph';
//   if (/\p{Block=Arrows}/u.test(character)) return 'arrow';
//   if (/[\p{Block=Geometric_Shapes}\p{Block=Miscellaneous_Symbols}]/u.test(character)) return 'bullet_or_star';
//   if (/\p{Block=Box_Drawing}/u.test(character)) return 'box_drawing';
//   if (/\p{Block=I_Ching_Hexagram_Symbols}/u.test(character)) return 'divination_symbol';
//   if (/\p{Block=Musical_Symbols}/u.test(character)) return 'musical_symbol';
//   if (/\p{Block=Enclosed_Alphanumerics}/u.test(character) || /\p{Block=Enclosed_Alphanumeric_Supplement}/u.test(character)) return 'enclosed_character';
//   if (/\p{Block=Ideographic_Description_Characters}/u.test(character)) return 'ideographic_description';
//   if (/\p{Block=Dingbats}/u.test(character)) return 'dingbat';
//   if (/[\p{Block=Miscellaneous_Symbols_And_Pictographs}\p{Block=Transport_And_Map_Symbols}]/u.test(character)) return 'sign_or_standard_symbol';
//   if (/\p{Block=Miscellaneous_Technical}/u.test(character)) return 'technical_symbol';
//   if (/\p{Block=Geometric_Shapes}/u.test(character)) return 'geometrical_shape';
//   return 'unknown';
// }

function characterType(character) {
  if (/[aeiou]/iu.test(character)) return 'vowel';
  if (/[bcdfghjklmnpqrstvwxyz]/i.test(character)) return 'consonant';
  if (/\s/.test(character)) return 'space';
  if (/[02468]/.test(character)) return 'even_number';
  if (/[13579]/.test(character)) return 'odd_number';
  // Emoji and other Unicode-specific categories are hard to match without Unicode properties.
  if (/[\.,!?\-\—;:'"(){}[\]]/.test(character)) return 'punctuation'; // Simplified punctuation
  if (/\$|€|£|¥|₹/.test(character)) return 'currency'; // Common currency symbols
  // Parentheses are included in the simplified punctuation category above.
  if (/[\+\-\*/=<>|%]/.test(character)) return 'math_symbol'; // Basic math symbols
  // Letterlike symbols, Latin script checks, and specific Unicode blocks are omitted due to limitations.
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

function createEl(element, class_name, content) {
  const el = document.createElement(element);
  el.className = class_name;
  if (content) {
    el.appendChild(content);
  }

  return el;
}

// function renderSvgRectangle(width, height, radius) {
//   const bg = useCustomProperty('--color-tan');
//   const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//   const rectEl = document.createElementNS(
//     'http://www.w3.org/2000/svg',
//     'rect'
//   );

//   svgEl.setAttribute('fill', bg);
//   svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
//   svgEl.setAttribute('stroke', 'none');
//   svgEl.classList.add('bg-svg');

//   rectEl.setAttribute('width', width)
//   rectEl.setAttribute('height', height)
//   rectEl.setAttribute('x', '0')
//   rectEl.setAttribute('y', '0')
//   rectEl.setAttribute('rx', radius)

//   svgEl.appendChild(rectEl);

//   return svgEl;
// }

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

function useCustomProperty(name) {
  // Get the value of the custom property
  const prop = getComputedStyle(document.documentElement).getPropertyValue(name);
  return prop;
}

function fullDraw(h_content, l_content) {

  patternViewer.innerHTML = '';
  let h_sentence = h_content || "";
  let v_sentence = l_content || "";
  if (h_sentence.length < 1) {
    h_sentence = "_"
  }
  if (v_sentence.length < 1) {
    v_sentence = "1"
  }

  const pattern_width = h_sentence.length
  const pattern_height = v_sentence.length

  // Get the value of the custom property
  const size = useCustomProperty('--box-size');

  patternViewer.style.width = `calc(${pattern_width} * ${size})`;
  patternViewer.style.height = `calc(${pattern_height} * var(--block-size))`;

  const blocks = Array.from(generateBlocks(h_sentence, v_sentence));
  const blocks_html = blocks.map(node => node.outerHTML).join('');
  patternViewer.innerHTML += blocks_html;
};

// function handlePaste(event) {
//   event.preventDefault();

//   const text = (event.clipboardData || window.clipboardData).getData('text/plain');
//   const selection = window.getSelection();

//   if (!selection.rangeCount) return;

//   const range = selection.getRangeAt(0);
//   range.deleteContents();
//   range.insertNode(document.createTextNode(text));
// }




console.log(patterns);

function savePattern(e) {
  console.log("save button pressed");
  e.preventDefault();
  let h_sentence = h_sentence_el.innerHTML || "";
  let v_sentence = v_sentence_el.innerHTML || "";
  // const text = (this.querySelector('[name=pattern]')).value;
  const patternItem = {
    h_sentence,
    v_sentence
  };

  patterns.push(patternItem);
  populateList(patterns, patternsList);
  localStorage.setItem('patterns', JSON.stringify(patterns));
  console.log(patterns);
  // this.reset();
}

// if (patterns.length > 0) {
//   savedPatternsLink.classList.add('show');
// }

if (currentUrl !== "/") {
  console.log("saved patterns page");
}

function populateList(patterns = [], patternsList) {
  if (currentUrl !== "/") {
    patternsList.innerHTML = patterns.map((pattern, i) => {
      console.log(pattern);
      console.log("- - - - ");
      const h_content = pattern.h_sentence;
      const v_content = pattern.v_sentence;
      const patternListItem = createEl("div", "pattern-list-item");
      const patternDivWrapper = createEl("div", "saved-pattern-wrapper");
      patternListItem.appendChild(patternDivWrapper);
      const pattern_h_el = createEl("div", "h-sentence");
      pattern_h_el.innerHTML = h_content;
      const pattern_v_el = createEl("div", "v-sentence");
      pattern_v_el.innerHTML = v_content;
      patternDivWrapper.appendChild(pattern_h_el);
      patternDivWrapper.appendChild(pattern_v_el);
      const patternDiv = createEl("div", "saved-pattern");
      patternDivWrapper.appendChild(patternDiv);
      patternDiv.id = i;
      // const h_el = createEl("span", "content", h_content);
      // const v_el = createEl("span", "content", v_content);
      // patternDiv.appendChild(h_el);
      // patternDiv.appendChild(v_el);
      // const renderPattern = patternDiv.outerHTML;
      // renderPattern.innerHTML(`<span>${h_content}</span><span>${v_content}</span>`);
      fullDraw(patternDiv, h_content, v_content);
      return patternListItem.outerHTML;
    }).join('');
  }
}

if (currentUrl === "/") {
  savePatternButton.addEventListener('click', savePattern);
}

populateList(patterns, patternsList);

if (currentUrl === "/") {
  (function () {
    fullDraw(horizontal_content, vertical_content);
    h_sentence_el.addEventListener('keyup', fullDraw);
    v_sentence_el.addEventListener('keyup', fullDraw);

    // h_sentence_el.addEventListener("paste", function (e) {
    //   e.preventDefault();

    //   var text = (e.clipboardData || window.clipboardData).getData('text/plain');
    //   var selection = window.getSelection();
    //   if (!selection.rangeCount) return;

    //   var range = selection.getRangeAt(0);
    //   range.deleteContents();
    //   range.insertNode(document.createTextNode(text));
    // });
  })();
}

// Define the Konami Code sequence using key codes
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
// This corresponds to: ↑ ↑ ↓ ↓ ← → ← → B A

// Initialize an array to keep track of the current sequence entered by the user
let currentSequence = [];

// Listen for keydown events on the entire document
document.addEventListener('keydown', (event) => {
  // Add the key code of the pressed key to the current sequence array
  currentSequence.push(event.keyCode);

  // If the current sequence length exceeds the Konami Code length, remove the oldest entry
  if (currentSequence.length > konamiCode.length) {
    currentSequence.shift();
  }

  // Check if the current sequence matches the Konami Code
  if (currentSequence.toString() === konamiCode.toString()) {
    // Select the .wrapper element
    const wrapperElement = document.querySelector('.wrapper');

    // Add the .fancy class to the .wrapper element
    if (wrapperElement) {
      wrapperElement.classList.add('fancy');
    }

    // Clear the current sequence to prevent the class from being added multiple times
    currentSequence = [];
  }
});
