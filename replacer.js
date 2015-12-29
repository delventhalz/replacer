// Load libraries.
var fs = require('fs');
var check = require('spellchecker');
var readline = require('readline-sync');

// Useful file paths.
var path = {
  defTarget: 'target.txt',
  cipher: './words/cipher.json',
  ignore: './words/ignore.json'
};

// Load JSON objects.
var cipher, ignore;
try {
  cipher = require(path.cipher);
} catch (err) {
  cipher = {};
}
try {
  ignore = require(path.ignore);
} catch (err) {
  ignore = {};
}

// Extras characters to count as parts of words.
var extras = {
  "'": true,
  '-': true
};

// Letters that were commmonly switched by printers.
var switches = {
  u: 'v',
  v: 'u',
  i: 'j',
  j: 'i'
};

// Skip object works like ignore, but is not saved to disk.
var skip = {};


// Traverse a string and decifer each word.
var transmogrify = function(string) {
  var result = '';
  var word = '';
  var wordStart = 0;
  var inWord = false;

  for (var i = 0; i < string.length; i++) {
    // Note the start of a word.
    if (!inWord && isLetter(string[i])) {
      inWord = true;
      wordStart = i;

    // At the end of a word, do a cipher lookup.
    } else if (inWord && !isLetter(string[i])) {
      word = string.slice(wordStart, i);
      result += decipher(word);
      result += string[i];
      inWord = false;

    // Just pass whitespace characters through.
    } else if (!inWord) {
      result += string[i];

    // Treat the end of the string as the end of a word.
    } else if (inWord && i === string.length - 1) {
      word = string.slice(wordStart, i + 1);
      result += decipher(word);
    }
  }

  return result; 
};

// Returns true if a character could be part of a word.
var isLetter = function(letter) {
  if (extras[letter]) return true;

  letter = letter.charCodeAt(0);

  if (letter > 64 && letter < 91) return true;    // A - Z
  if (letter > 96 && letter < 123) return true;   // a - z
  if (letter > 191 && letter < 383) return true;  // À - ž
  return false;
};

// Check if a commonly switched character is in a word.
var switchIsIn = function(word) {
  word = word.toLowerCase();

  for (var key in switches) {
    if (word.indexOf(switches[key]) > -1) return true;
  }

  return false;
}

// Returns a word from cipher, or prompts if unknown. Handles caps.
var decipher = function(word) {
  var allCaps = word == word.toUpperCase();
  var capitalized = word[0] == word[0].toUpperCase() && !allCaps;

  if (allCaps) word = word.toLowerCase();
  if (capitalized) word = word[0].toLowerCase() + word.slice(1);

  if (cipher[word]) {
    word = cipher[word];
  } else if (check.isMisspelled(word) && 
    switchIsIn(word) && !ignore[word] && !skip[word]) {
    word = prompt(word);
  }

  if (allCaps) word = word.toUpperCase();
  if (capitalized) word = word[0].toUpperCase() + word.slice(1);

  return word;
};

// Prompt the user for the spelling of a word.
var prompt = function(word) {
  var changed = readline.question(word + '? ');

  if (changed.length === 0) {
    ignore[word] = true;
    return word;
  }

  if (changed === '`') {
    skip[word] = true;
    return word;
  }

  if (changed === '*') {
    changed = '';
    for (var i = 0; i < word.length; i++) {
      if (switches[word[i]]) {
        changed += switches[word[i]];
      } else {
        changed += word[i];
      }
    }

  } else if (switches[changed]) {
    // Build RegExp object to replace all shortcut instances.
    var regexp = new RegExp(switches[changed], 'g');
    changed = word.replace(regexp, changed);
  }

  cipher[word] = changed;
  ignore[changed] = true;
  return changed;
}

// Create a readable JSON string.
var readableJSON = function(obj) {
  var min = JSON.stringify(obj);
  var readable = '';

  for (var i = 0; i < min.length; i++) {
    if (min[i] === ',') readable += ',\n  ';
    else if (min[i] === ':') readable += ': ';
    else if (min[i] === '{') readable += '{\n  ';
    else if (min[i] === '}') readable += '\n}';
    else readable += min[i];
  }

  return readable;
};


// Write to disk the updated text, cipher, and ignore list.
var write = function(data) {
  fs.writeFile(path.target, data, 'utf8', function(err) {
    if (err) throw err;
  });
  fs.writeFile(path.cipher, readableJSON(cipher), 'utf8', function(err) {
    if (err) throw err;
  });
  fs.writeFile(path.ignore, readableJSON(ignore), 'utf8', function(err) {
    if (err) throw err;
  });
};


// If no arguments are provided, use the default textfile.
if (process.argv.length < 3) {
process.argv[2] = path.defTarget;
}

// Process each of the arguments.
for (var i = 2; i < process.argv.length; i++) {
  path.target = process.argv[i];
  var text = fs.readFileSync(path.target, 'utf8');
  write(transmogrify(text));
}