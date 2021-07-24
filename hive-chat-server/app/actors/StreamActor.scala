package actors

import akka.actor.ActorRef
import akka.actor.Props
import akka.actor.Actor
import java.util.UUID.randomUUID

class StreamActor(
    roomId: String,
    user: String,
    streamManager: ActorRef,
    out: ActorRef
) extends Actor {
  val uniqueUserId : String = user + "-" + randomUUID().toString
  streamManager ! StreamManager.NewUser(roomId, user, out)

  import StreamActor._

  def receive: Receive = {
    case message: String => {
      streamManager ! StreamManager.Message(s"$user:$message", roomId, user)
    }
  }

  override def postStop(): Unit = {
    streamManager ! StreamManager.RemoveUser(roomId, user)
  }
}

object StreamActor {
  def props(
      roomId: String,
      user: String,
      streamManager: ActorRef,
      out: ActorRef
  ) = Props(new StreamActor(roomId, user, streamManager, out))
}
