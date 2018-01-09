var fs = require('fs');
var chokidar = require('chokidar');

const filePath = `/Users/${process.env.USER}/Documents/Zoom/`;

var watcher = chokidar.watch(filePath, {
  ignored: /^((?!zoom_0).)*$/g,
  persistent: true,
  depth: 2
});

watcher.on('add', (path) => {
   if (path.slice(-10) === 'zoom_0.mp4') console.log('hi');
});
