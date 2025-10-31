import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';

const questions = [
  {
    type: 'input',
    name: 'url',
    message: 'Enter the URL to generate a QR code for:',
  },
];

inquirer.prompt(questions).then((answers) => {
  fs.writeFile('url.txt', answers.url, (err) => {
    if (err) throw err;
    console.log('URL written to file');
  });
  var qr_png = qr.image(answers.url, { type: 'png' });
  qr_png.pipe(fs.createWriteStream('qr.png'));
  console.log('QR code generated successfully');
});
