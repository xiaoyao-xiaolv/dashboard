const fs = require('fs');
const glob = require("glob");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const directories = getDirectories('./');

const buildVisual = async dir => {
  console.log(`Processing: ${dir} ---------------`);
  let stdout, stderr;
  ({ stdout, stderr } = await exec('npm i', { cwd: `./${dir}` }));
  // stdout && console.log(stdout);
  if (stderr && ~stderr.indexOf('ERR')) throw stderr;

  ({ stdout, stderr } = await exec('wyn-visual-tools package', { cwd: `./${dir}` }));
  // stdout && console.log(stdout);
  if (stderr && ~stderr.indexOf('ERR')) throw stderr;

  var visual = glob.sync(`${dir}/*.viz`);
  if (visual.length > 0) {
    visual = visual.shift();
  } else {
    throw 'No visual generated.';
  }
  
  fs.copyFileSync(visual, visual.replace(dir, 'dist'));
};

const blackList = ['DateSlicer']; // cannot package
const buildVisuals = async dirs => {
  for (let i = 0;i < dirs.length; ++i) {
    const dir = dirs[i];
    if (blackList.includes(dir) || !fs.existsSync(`${dir}/visual.json`)) continue;
    try {
      await buildVisual(dir);
    } catch (err) {
      console.error(err);
      console.log('Retrying...');
      await buildVisual(dir);
    }
  }
};

glob.sync('*/*.viz').forEach(f => {
  fs.unlinkSync(f);
});

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

buildVisuals(directories)
  .then(() => {
    console.log('Build visuals successfully completed.');
  })
  .catch(err => {
    console.error(err);
    throw err;
  });
