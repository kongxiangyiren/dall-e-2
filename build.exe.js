const { execSync } = require('child_process');
const { rmSync, renameSync, mkdirSync, cpSync } = require('fs');

let runName = process.platform === 'win32' ? 'hello.exe' : 'hello';

rmSync(`./${runName}`, {
  recursive: true,
  force: true,
});
cpSync(process.execPath, runName);
execSync(
  `npx postject ${runName} NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2`,
);

rmSync(`./dist`, {
  recursive: true,
  force: true,
});

mkdirSync('./dist');
renameSync(`./${runName}`, `./dist/${runName}`);

cpSync('./.env', './dist/.env');
cpSync('./public', './dist/public', {
  recursive: true,
  force: true,
});
