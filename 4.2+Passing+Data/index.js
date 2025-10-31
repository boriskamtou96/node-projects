import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.post('/submit', (req, res) => {
  let fName = req.body['fName'].length;
  let lName = req.body['lName'].length;

  let letterCount = fName + lName;

  console.log(`${fName} ${lName}`);
  res.render('index.ejs', {
    letterCount: letterCount,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
