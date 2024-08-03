#!/usr/bin/env bash

# Define the repository URL and directory
REPO_URL="https://github.com/LukaNikolaisvili/GITHUB-BOT.git"
REPO_DIR="/var/jenkins_home/workspace/GITHUB_BOT/GITHUB-BOT"

# Ensure the repository directory is safe for Git
git config --global --add safe.directory $REPO_DIR

# Check if the repository directory exists
if [ ! -d "$REPO_DIR" ]; then
  echo "Cloning repository..."
  git clone https://${GITHUB_TOKEN}@github.com/LukaNikolaisvili/github_bot.git $REPO_DIR
else
  echo "Repository already exists. Pulling latest changes..."
  cd $REPO_DIR || exit 1
  git pull
fi

# Navigate to the repository directory
cd $REPO_DIR || { echo "Failed to change directory to $REPO_DIR"; exit 1; }

# Generate commit information
info="Commit: $(date)"
echo "$info" >> output.txt || { echo "Failed to write to output.txt"; exit 1; }
echo "$info"
echo

# Set up Git to use the personal access token from environment variable
git remote set-url origin https://${GITHUB_TOKEN}@github.com/LukaNikolaisvili/GITHUB-BOT.git

# Configure Git to handle divergent branches by merging
git config pull.rebase false

# Pull the latest changes
git pull

# Ship it
git add output.txt
git commit -m "$info"
git push origin main # or "master" on old setups
