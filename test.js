var fs = require('fs');
const filePath = `/Users/${process.env.USER}/Documents/Zoom`;


fs.watch(filePath, () => {
  const directories = fs.readdirSync(filePath);
  const newPath = `${filePath}/${directories[directories.length - 1]}`;
  if (newPath.slice(-3) !== 'mp4' && newPath.slice(-3) !== 'txt') {
    const files = fs.readdirSync(newPath);
    files.forEach((file) => {
      if (file.slice(-3) === 'mp4') {
        const path = `${newPath}/${file}`;
        fs.createReadStream(path).pipe(fs.createWriteStream(`${filePath}/zoom.mp4`));
      }
    })
  }
});

