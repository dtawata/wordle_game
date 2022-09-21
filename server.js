const express = require('express');
const app = express();
const { getWord, validWord } = require('./lib/import');

app.use(express.json());
app.use(express.static('public'));

app.get('/api/word', (req, res) => {
  res.send(getWord());
});

app.get('/api/valid/:word', (req, res) => {
  res.send(validWord(req.params.word));
});

const port = 3000;
app.listen(port, () => {
  console.log('Listening on http://localhost:' + port);
});