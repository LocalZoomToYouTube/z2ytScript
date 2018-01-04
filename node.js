const fs = require('fs');
const notifier = require('node-notifier');
const { spawnSync } = require('child_process');

fs.chmodSync('z2yt.sh', '755');

notifier.notify({
  title: 'Zoom To Youtube',
  message: 'We noticed you recently recorded a zoom video.  Would you like to upload it to youtube?',
  actions: "Yes",
  closeLabel: 'Not This Time',
  reply: true,
  sound: true
});

notifier.on('click', (object, options) => {
  const child = spawnSync('sh', ['z2yt.sh'], { stdio: 'inherit' });
});
