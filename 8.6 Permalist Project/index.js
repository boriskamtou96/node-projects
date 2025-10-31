import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// configure db admin
const db = new pg.Client({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  database: 'permalist',
  port: 5432,
});
db.connect();

let items = [];

async function getItems() {
  let data = [];
  const result = await db.query('SELECT * FROM items');
  result.rows.forEach((item) => {
    data.push(item);
  });
  return data;
}

app.get('/', async (req, res) => {
  items = await getItems();
  res.render('index.ejs', {
    listTitle: 'Today',
    listItems: items,
  });
});

app.post('/add', async (req, res) => {
  const newItem = req.body.newItem;
  const result = await db.query(
    'INSERT INTO items (title) VALUES ($1) RETURNING *',
    [newItem]
  );
  const createdItem = result.rows[0];
  items.push(createdItem);
  res.redirect('/');
});

app.post('/edit', async (req, res) => {
  const id = req.body.updatedItemId;
  const newTitle = req.body.updatedItemTitle;
  await db.query('UPDATE items SET title = $1 WHERE id = $2', [newTitle, id]);
  res.redirect('/');
});

app.post('/delete', async (req, res) => {
  const deleteItemId = req.body.deleteItemId;
  await db.query('DELETE FROM items WHERE id = $1', [deleteItemId]);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
