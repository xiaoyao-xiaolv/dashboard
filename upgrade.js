const fs = require('fs');
const serverInc = require('semver/functions/inc');

const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

const directories = getDirectories('./');

const upgradeVisual = dir => {
    const packageString = fs.readFileSync(`./${dir}/package.json`, 'utf-8');
    const packageObject = JSON.parse(packageString);
    const originVersion = packageObject.version;
    const upgradeVersion = serverInc(originVersion, 'patch');
    console.log(`Upgrade: ${dir} from '${originVersion}' to '${upgradeVersion}'`);
    packageObject.version = upgradeVersion;
    fs.writeFileSync(`./${dir}/package.json`, JSON.stringify(packageObject, null, 2));
}

const upgradeVisuals = dirs => {
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        if (!fs.existsSync(`${dir}/package.json`)) continue;
        try {
            upgradeVisual(dir);
        } catch (err) {
            throw err;
        }
    }
}

try {
    upgradeVisuals(directories);
    console.log('Upgrade visuals successfully completed.');
} catch (err) {
    console.error(err);
};
