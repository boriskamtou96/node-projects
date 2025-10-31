import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'world',
  password: 'postgres',
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let currentUserId = 1;

async function checkVisisted(userId) {
  const result = await db.query(
    'SELECT country_code FROM visited_countries AS vs JOIN users ON vs.user_id = $1',
    [userId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getAllUsers() {
  const result = await db.query('SELECT * FROM users');
  let users = [];
  result.rows.forEach((user) => {
    users.push(user);
  });

  return users;
}

async function getCurrentUser() {
  const result = await getAllUsers();
  return result.find((user) => user.id == currentUserId);
}

app.get('/', async (req, res) => {
  const countries = await checkVisisted(currentUserId);
  const users = await getAllUsers();
  const currentUser = await getCurrentUser();

  res.render('index.ejs', {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUser.color,
  });
});

app.post('/add', async (req, res) => {
  const input = req.body['country'];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    try {
      const countryCode = data.country_code;
      await db.query(
        'INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)',
        [countryCode, currentUserId]
      );
      res.redirect('/');
    } catch (err) {
      console.log('Country not found');
      res.redirect('/');
    }
  } catch (err) {
    console.log(err);
  }
});

app.post('/user', async (req, res) => {
  if (req.body.add) {
    res.render('new.ejs');
  } else if (req.body.user) {
    currentUserId = req.body.user;
    res.redirect('/');
  } else {
    console.log('Aucun bouton reconnu');
    res.status(400).send('Bad request');
  }
});

app.post('/new', async (req, res) => {
  const name = req.body.name;
  const color = req.body.color;

  console.log(`Body: ${name} ${color}`);

  const result = await db.query(
    'INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *',
    [name, color]
  );

  const id = result.rows[0].id;
  currentUserId = id;

  console.log(`Created user name: ${currentUserId}`);

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
