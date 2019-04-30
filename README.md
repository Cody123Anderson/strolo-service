# serenade-service
Serverless Application to host all Serenade Dates APIs

### Running Locally
- Install Postgres locally using homebrew
  - `brew install postgresql`
  - `ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents`
  - Add the following two aliases to your `.bash_profile`
    - `alias pgstart="launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist"`
    - `alias pgstop="launchctl unload ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist"`
  - `pgstart`
  - `createdb serenadetestdb`
  - `createuser <username>`
  - Connect to your postgres with the command: `psql`
  - `alter user <username> with encrypted password '<password>';`
  - `grant all privileges on database <dbname> to <username> ;`
- Create a local Postgres DB based off of the `serverless.env.yml` dev config
- `npm i -g sequelize sequelize-cli pg`
- Migrate the local db by running `sequelize db:migrate`
- `npm i`
- Copy `serverless.env.example.yml` and create file `serverless.env.yml`
- Run `npm start` (runs serverless offline)
- Hit endpoints using postman collection

### Deploy
- set your local .aws credentials to the correct keys
- deploy to dev: `npm run deploy-dev`
- deploy to prod: `npm run deploy-prod`
