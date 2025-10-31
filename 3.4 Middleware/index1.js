import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true })); // 'use' keyword is used to apply middleware to all routes
app.use(morgan('combined')); // 'combined' is a pre-defined format for logging

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', (req, res) => {
  console.log(req.body);
  res.send('Successfully submitted');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
