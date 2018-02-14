# Testing User Login React/Firebase/Re-base
Work in progress

App checks for user authentication using the firebase webapi (through the re-base library). Users can make changes to the firebase database only when in an authenticated session. They can authenticate by creating an account and verifying an email address.

Authenticated users are enforced by the database rules on the firebase server.

Passwords are sent to firebase using HTTPS.

## Install
* install with `npm install`
* create a firebase account and get you webapi key info
* edit the "rebaseOptions.sample.json" to rebaseOptions.json and place you apikey info inside

## Start
* start with `npm start`
* this will start the dev server
