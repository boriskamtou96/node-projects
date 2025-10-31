const fs = require('fs');

fs.writeFile('hello.txt', 'Hello Boris!!!', (err) => {
  if (err) throw err;
  console.log('File created successfully');
});

fs.readFile('hello.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(`File content: ${data}`);
});
