# cobyo-video
React app for video chat capabilities

## Development
```
// To run the app locally
npm run start
```
See `package.json` for other scripts to run.

## Test locally with multiple computers
### Computer 1
1. Find your local ip address (check the console output after you run `npm run dev` for the React app) (`192.168.1.167` for example)
2. Create `.env.development.local` if it does not exist
3. Add `REACT_APP_BASE_API_URL=https://<ip address>:8080` to `.env.development.local`
4. Re-run `npm run dev`
5. Open the page and check the network tab for requests that are made to the ip address.

### Computer 2
1. Go to `https://<ip address>:3000`
2. If network requests fail, go directly to the URL of the request (i.e. `https://<ip address>:8080/<endpoint path here>`)
3. Permit the browser if security issues appear.
4. Refresh `https://<ip address>:3000`

## Deploying
This project is deployed using AWS Amplify, which is hooked up to the *master* branch of this repo.
**Every push to cobyo-video master will trigger a deploy!**
