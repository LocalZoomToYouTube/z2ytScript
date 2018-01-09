const fs = require('fs');
const notifier = require('node-notifier');
const readline = require('readline');
const chokidar = require('chokidar');


const filePath = `/Users/${process.env.USER}/Documents/Zoom`;
const appPath = `/Users/${process.env.USER}/.zoom_to_youtube`;

if (!fs.existsSync(appPath)) fs.mkdirSync(appPath, 0755);

const watcher = chokidar.watch(filePath, {
  ignored: /^((?!zoom_0).)*$/g,
  persistent: true,
  depth: 2
});

watcher.on('add', (path) => {
   if (path.slice(-10) === 'zoom_0.mp4') {
      fs.createReadStream(path).pipe(fs.createWriteStream(`${appPath}/zoom.mp4`));
        notifier.notify({
          title: 'Zoom To Youtube',
          message: 'We noticed you recently recorded a zoom video.  Would you like to upload it to youtube?',
          actions: "Yes",
          closeLabel: 'Not This Time',
          reply: true,
          sound: true
        });
   }
});


notifier.on('click', (object, options) => {
  const child = require('child_process').execSync(`
    osascript -e 'tell app "Terminal"
      do script "cd ${__dirname}\nnode youtubeConvert.js"
    end tell'`);
    // Will need linux and windows equivalent
});

