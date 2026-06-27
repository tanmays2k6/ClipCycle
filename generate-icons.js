/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');

// Based on the layout of a 1024x1024 image with icon on the left
const size = 260;
const left = 100;
const top = 380;

sharp('public/images/logo.jpg')
  .extract({ left, top, width: size, height: size })
  .toBuffer()
  .then(buffer => {
    sharp(buffer).resize(512, 512).toFile('src/app/icon.png');
    sharp(buffer).resize(180, 180).toFile('src/app/apple-icon.png');
    sharp(buffer).resize(32, 32).toFile('src/app/favicon.ico');
    console.log("Icons generated successfully");
  })
  .catch(err => console.error(err));
