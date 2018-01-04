// const exec = require('child_process').exec;
// const testscript = exec('sh z2yt.sh /directory');

// testscript.stdout.on('data', function(data){
//     console.log(data); 

//     // sendBackInfo();
// });



// testscript.stderr.on('data', function(data){
//     console.log(data);
//     // triggerErrorStuff(); 
// });

const child = require('child_process');
child.spawn('sh', ['z2yt.sh'], {stdio: 'inherit'});
