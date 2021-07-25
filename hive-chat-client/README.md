# Sample WebRTC Chat Client

## Demo
Deployed as a static website in Microsoft Azure: <a href="https://chat.nowzarifarhad.dev" target="_blank">https://chat.nowzarifarhad.dev</a>

On the landing page please enter a `Room` name and your `DisplayName`. You will use the entered `Room` value for other users which are willing to join **(CASE SENSITIVE)**.

## How is it working?

This project is a vue project which uses `peerjs` for `WebRTC` implementation and the `cloud peerjs-server` is used to server side streaming. 

The peer-server is also available as `docker` image in docker hub which we could deploy as WebApp into Microsoft azure and use our own private server.

When the user enters a `room` the client app will do the following steps:
- It will open a connection with `peerjs-server` and will receive a random `UUID`
- It will build a `connectionId` by combining `${name}|${peerUserId}`.
- It will ask for permission to access the camera.
- When the permission is given, it will start listening to incoming calls from peerjs
- Now since it is ready to establish a connection to all users in the room, it will send the `connectionId` to the backend which is a `Scala play websocket` project and will open a websocket as long as the page is open.
- By the previous action the user has announced his/her join to the room for everyone so everyone will call our user. The already connected users will put their info on the call `metadata` so the new user also knows their name. 
- The user will answer the calls and will send his `Streams` as a response to the incoming calls (the streams will be handled by the peer-2-peer connection)
- The other users are listening on receiving an incoming stream and since they already have the information of this user, they will use this info to build a `UserMessage` object and will push it to party users.

## Project setup
Please enter the following command to set the `node_modules` folder.
```
npm install
```

### Compiles and hot-reloads for development
The following command will let you to run the client app and watch the changes live with `node-sockets`.
```
npm run serve
```

### Compiles and minifies for production
The following command will build your application for production.

Please note if you don't have the `.env.production` it will use .env file to build the project.

**NOTE:** in vue build `.env.{mode}` files will be embedded into the built javascript file.
```
npm run build
```
if you have another mode for building your application you can use the following command
```
npm run build -- --mode YOUR_MODE
```
