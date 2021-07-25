# Sample chat server

This project is the first I have done with Scala. The funny thing is that when I wanted to start coding with it for no reason I though its like PHP but it is nothing like it 😅.

So lets see how this works.

- First we setup an endpoint so clients can access and open a socket connection. This endpoint is a normal endpoint but instead of seting up an `Action` it will need you to accept a `WebSocket`. This endpoint is configurable from `routes` file.
- Inside the opened `WebSocket` we will create a new `Actor` and this actor lives until the `WebSocket` is open. It means any message which transmits to backend from the client of this `Socket` will now use this created `Actor`. I have named this actor, `StreamActor`.
- `StreamActor` for initiation will receive `roomId`, `userId`, `StreamManager` and `out: ActorRef`.
    - `out: ActorRef` is simply the connection between the connected client and the server and we will use it to send messages back to the connected client.
    - `roomId` and `userId` are the parameters which the client introduced herself with and we will use this mostly in frontend but we also keep these values inside another global `Actor` I called it `StreamManager` to keep track of connected clients to each `Room` so we don't send back a message to its sender (Most of the time it is not necessary the client can handle the sent message easier and it doesn't need to treat it like the other incoming messages).
    - `StreamManager`, as mentioned previously will keep track of everyone connected by their rooms.
- When `StreamActor` is created it will tell the `StreamManager` to add this new user. StreamManager has a `Map[String, ChatRoom]` which the key is the RoomId. if the `RoomId` doesn't exist, it will create a room and insert the user inside that room otherwise it will just directly request to insert the user.
- After the user is added to created/existed room, it will announce her join to everyone in the room EXCEPT herself.
- For handling the close, it will also notify everyone in the Room that this user is disconnected so the clients can act on this and remove that `User`'s stream from their view.

## Run the project
The following command will run the project and will fetch the needed packages.
```
sbt run
```

## Build for production
For production a `SecretKey` is needed. which you can get with the following command.
```
sbt playUpdateSecret
```
The result of the command above will give you a random `SecretKey`. You need to add this key to your `prod.conf` file like below
```
play.http.secret.key="GENERATED_KEY"
```
Please note that inside your `prod.conf` you need the following line as well to allow the host to access the application otherwise you will receive a BadRequest `Host is not allowed` error after deployment.
```
play.filters.hosts {
  allowed = ["."]
}
```
Now to build your project you need to run the following command
```
sbt dist
```
The command above will archive your project's executables for different running environments and will put it under `target/univeral`.

You either now use a `Dockerfile` for deployment or deploy the executables directly into a server. In my case I found deploying with `Docker` easier. The docker file exists in the project repo.

## Unit tests
At the moment no unit tests are written for this project.


