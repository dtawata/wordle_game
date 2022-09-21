const fs = require('fs');
const words = fs.readFileSync('./lib/words-all.txt', 'utf8').replaceAll(' ', "','");
fs.writeFileSync('./lib/test.txt', words);