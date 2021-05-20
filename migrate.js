const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const currentCliVersion = require('./package.json').devDependencies['@grapecity/wyn-visual-tools'];

const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

const directories = getDirectories('./');

const migrateVisual = async dir => {
    const visual = fs.readFileSync(`./${dir}/visual.json`, 'utf-8');
    const sourceVersion = JSON.parse(visual).cliVersion || '1.0.0';
    console.log(`Migrate: ${dir} from '${sourceVersion}' to '${currentCliVersion}'`);
    await exec('wyn-visual-tools migrate', { cwd: `./${dir}` });
}

const migrateVisuals = async dirs => {
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        if (!fs.existsSync(`${dir}/visual.json`)) continue;
        try {
            await migrateVisual(dir);
        } catch (err) {
            throw err;
        }
    }
}

migrateVisuals(directories)
    .then(() => {
        console.log('Migrate visuals successfully completed.');
    }).catch(console.error);