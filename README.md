# BlueBubbles Copilot

A bot used to interact with BlueBubbles and the BlueBubbles Community.

## Usage

### Pre-requisites

Before using this bot, you will need to setup the environment by performing these requisites.

- Install NodeJS:
    - Windows: https://nodejs.org/en/download
    - CentOS
        - `curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -`
        - `sudo yum install nodejs`
    - Debian
        - `sudo apt update`
        - `sudo apt install nodejs`
- Install git:
    - Windows: https://git-scm.com/downloads
    - macOS: `brew install git`
    - CentOS: `sudo yum install git`
    - Debian: `sudo apt install git`
- Create a "Github App" within your user/organization settings (Developer Mode)
- Create a Discord "Application"

### Running the Bot

1. Clone this repository
    - `git clone https://github.com/BlueBubblesApp/bluebubbles-helper.git`
2. Navigate into the project's directory
    - `cd bluebubbles-helper`
3. Install the dependencies
    - Yarn: `yarn`
    - NPM: `npm install`
4. Build the bot
    - `npm run build:release`
5. Rename the `.env.example` to `.env`
    - Linux: `mv .env/example .env`
6. Edit the `.env` file and enter your Github & Discord credentials
    - Github: Create a `Github App` to generate credentials
    - Discord: Create an `Application` to generate credentials
7. Run the bot
    - `node ./build/main.js`


### Collaborators

Follow these instructions if you wish to contribute to the project.

1. Clone this repository
    - `git clone https://github.com/BlueBubblesApp/bluebubbles-helper.git`
2. Create 2 terminals (A & B) and navigate to the project folder in each.
    - `cd bluebubbles-helper`
3. In either terminal, rename the `.env.example` to `.env`
    - Linux: `mv .env/example .env`
4. Edit the `.env` file and enter your Github & Discord credentials
5. In terminal A, run the following command to create a "watcher" to automatically re-compile the app when changes are made (`./src`)
    - Yarn: `yarn run build:watch`
    - NPM: `npm run build:watch`
6. In terminal B, run the app using this command:
    - `node ./build/main.js`
    - The app will run until killed
7. Repeat step 5 whenever you make changes.
8. Happy developing!
