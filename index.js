const { exec } = require('child_process');
const moment = require('moment');
const simpleGit = require('simple-git');
const jsonfile = require('jsonfile');
const path = require('path');
const fs = require('fs');

const REPO_URL = "https://github.com/LukaNikolaisvili/GITHUB-BOT.git";
const REPO_DIR = "/var/jenkins_home/workspace/GITHUB-BOT/GITHUB-BOT";
const FILE_PATH = path.join(REPO_DIR, 'output.txt');

// Function to execute shell commands
const execute = command => new Promise((resolve, reject) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return reject(error);
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    resolve(stdout || stderr);
  });
});

const makeCommit = async (n) => {
  // Ensure the repository directory is safe for Git
  await execute(`git config --global --add safe.directory ${REPO_DIR}`);

  if (!fs.existsSync(REPO_DIR)) {
    console.log("Cloning repository...");
    await execute(`git clone https://${process.env.GITHUB_TOKEN}@github.com/LukaNikolaisvili/GITHUB-BOT.git ${REPO_DIR}`);
  } else {
    console.log("Repository already exists. Pulling latest changes...");
    await execute(`cd ${REPO_DIR} && git pull`);
  }

  const git = simpleGit(REPO_DIR);  // Initialize simple-git after ensuring the directory exists

  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * 54);
    const y = Math.floor(Math.random() * 6);
    const DATE = moment().subtract(1, 'y').add(1, 'd').add(x, 'w').add(y, 'd').format();

    const data = `Commit: ${DATE}\n`;

    console.log(DATE);
    fs.appendFileSync(FILE_PATH, data);

    await git.add([FILE_PATH]);
    await git.commit(DATE, { '--date': DATE });
  }

  await git.push('origin', 'main'); // or 'master' on older setups
};

makeCommit(500).catch(err => console.error(err));
