import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = new pg.Client({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  database: 'secrets',
  port: 5432,
});
db.connect();

app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send('User already exists. Try loggin');
    } else {
      bcrypt.hash(password, saltRounds, async (err, hashPassword) => {
        if (err) {
          console.log(err);
        } else {
          const result = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, hashPassword]
          );

          const data = result.rows[0];

          console.log(`Create user: ${data.email}`);

          res.render('secrets.ejs');
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post('/login', async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      const userPassword = checkResult.rows[0].password;

      bcrypt.compare(password, userPassword, async (err, result) => {
        if (err) {
          res.send('Error retreiving password');
        } else {
          if (result) {
            res.render('secrets.ejs');
          } else {
            res.send('Wrong password');
          }
        }
      });
    } else {
      res.send('User not found. Try register');
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
