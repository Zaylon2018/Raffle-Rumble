Raffle Rumble - Render-ready fullstack demo


How to run locally:

1. Install all deps:
   npm run install:all
2. Build the client:
   npm run build
3. Start the server:
   npm start

Server exposes API at /api/* and serves the built client from client/dist.

Deploy to Render: create a new Web Service from this repo, set build command to `npm run build` and start command to `npm start`.
