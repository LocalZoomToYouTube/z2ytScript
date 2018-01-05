const fs = require('fs');
const notifier = require('node-notifier');
const { spawnSync } = require('child_process');
const readline = require('readline');
const util = require('util');
const google = require('googleapis');
const googleAuth = require('google-auth-library');


const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';


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
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // fs.readFile('./vids/upload.txt', (err, data) => {
  //   if (err) console.log(err);
  //   console.log(data);
  // })
  authorize(JSON.parse(content), {'params': {'part': 'snippet,status'}, 'properties': {'snippet.categoryId': '22',
                 'snippet.description': 'Description of uploaded video.',
                 'snippet.title': 'Test',
                 'status.privacyStatus': 'unlisted',
      }, 'mediaFilename': './vids/zoom.mp4'}, videosInsert);
  });
});



function authorize(credentials, requestData, callback) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, requestData, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, requestData);
    }
  });
}


function getNewToken(oauth2Client, requestData, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, requestData);
    });
  });
}


function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

function removeEmptyParameters(params) {
  for (let p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}


function createResource(properties) {
  const resource = {};
  const normalizedProps = properties;
  for (let p in properties) {
    const value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      const adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }
  for (let p in normalizedProps) {
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      const propArray = p.split('.');
      let ref = resource;
      for (var pa = 0; pa < propArray.length; pa++) {
        const key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    };
  }
  return resource;
}


function videosInsert(auth, requestData) {
  const service = google.youtube('v3');
  const parameters = removeEmptyParameters(requestData['params']);
  parameters['auth'] = auth;
  parameters['media'] = { body: fs.createReadStream(requestData['mediaFilename']) };
  parameters['notifySubscribers'] = false;
  parameters['resource'] = createResource(requestData['properties']);
  let req = service.videos.insert(parameters, function(err, data) {
    if (err) {
      console.log('The API returned an error: ' + err);
    }
    if (data) {
      console.log(util.inspect(data, false, null));
    }
    process.exit();
  });

  const fileSize = fs.statSync(requestData['mediaFilename']).size;
  const id = setInterval(function () {
    const uploadedBytes = req.req.connection._bytesDispatched;
    const uploadedMBytes = uploadedBytes / 1000000;
    const progress = uploadedBytes > fileSize
        ? 100 : (uploadedBytes / fileSize) * 100;
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(uploadedMBytes.toFixed(2) + ' MBs uploaded. ' +
       progress.toFixed(2) + '% completed.');
    if (progress === 100) {
      process.stdout.write('Done uploading, waiting for response...');
      clearInterval(id);
    }
  }, 250);
}
