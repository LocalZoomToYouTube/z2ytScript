const fs = require('fs');
const { spawnSync } = require('child_process');

fs.chmodSync('z2yt.sh', '755');
const child = spawnSync('sh', ['z2yt.sh'], { stdio: 'inherit', });