This is a single page data logger progressive web app.

# Technologies

This uses react-scripts for build and development. It uses sw-precache to set up offline capabilities. It uses PouchDB for data storage and sync with a remote CouchDB capable database.

# Developing

To develop the site, you should just need to run `npm start` and react scripts will start an auto-reloading server at localhost:3000.

# Build and deployment

To build the application you can run `npm run build`. This will stick everything you need in the `build` folder.

To deploy (to my github pages), run `npm run build && npm run deploy`.
