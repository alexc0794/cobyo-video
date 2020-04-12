# cobyo-video
React app for video chat capabilities

## Development
```
// To run the app locally
npm run start
```
See `package.json` for other scripts to run.

## Test locally with multiple computers
1. find your local server's ip (you will see it on screen after you run `npm run dev` on the frontend)
2. open `.env.development`
3. change the first line to `REACT_APP_BASE_API_URL=https://[your local ip]:8080`
4. run `npm run dev` again so that gets built
5. make sure request are made to this address in your network tab (`https://192.168.1.167:8080/menu/CLUB` for example)
6. Your other computer should be able to access it via the local ip

## Deploying
This project is deployed using AWS Amplify, which is hooked up to the *master* branch of this repo.
**Every push to cobyo-video master will trigger a deploy!** 
