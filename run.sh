#!/usr/bin/env bash

# Define the repository URL and directory
REPO_URL="https://github.com/LukaNikolaisvili/GITHUB-BOT.git"
REPO_DIR="/var/jenkins_home/workspace/test/GITHUB-BOT"

# Ensure the repository directory is safe for Git
git config --global --add safe.directory $REPO_DIR

# Check if the repository directory exists
if [ ! -d "$REPO_DIR" ]; then
  echo "Cloning repository..."
  git clone https://${GITHUB_TOKEN}@github.com/LukaNikolaisvili/GITHUB-BOT.git $REPO_DIR
else
  echo "Repository already exists. Pulling latest changes..."
  cd $REPO_DIR || exit 1
  
  # Check for unmerged files
  if git ls-files -u | grep -q '^'; then
    echo "Unmerged files detected. Please resolve conflicts manually."
    exit 1
  fi
  
  git config pull.rebase false # Configure git to use merge strategy
  git pull
fi

# Navigate to the repository directory
cd $REPO_DIR || { echo "Failed to change directory to $REPO_DIR"; exit 1; }

# Check if package.json exists
if [ ! -f package.json ]; then
  echo "package.json not found. Skipping npm install."
else
  # Install required Node.js modules
  npm install
fi

# Execute the Node.js script
node /var/jenkins_home/workspace/GITHUB_BOT/GITHUB-BOT/index.js
