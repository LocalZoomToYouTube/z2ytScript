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




// var CronJob = require('cron').CronJob;
// new CronJob('* * * * * *', function() {
//   fs.watch(filePath, function(event, fileName) {
//     if(fileName) {
//       console.log('Event: ' + event);
//       console.log(filename + ' File Change ...');
//       file = fs.readFileSync(filePath);
//       console.log("File content at: " + new Date() + ' is \n' + file);
//     }
//     else{
//       console.log('filename not provided')
//     }
//   });
// }, null, true, 'America/Los_Angeles');