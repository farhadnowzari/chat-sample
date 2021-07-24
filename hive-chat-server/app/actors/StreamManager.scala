package actors

import akka.actor.Actor
import akka.actor.ActorRef

class StreamManager extends Actor {

  import StreamManager._

  type RoomsMap = Map[String, ChatRoom]
  var rooms: RoomsMap = Map()

  def receive: Receive = {
    case NewUser(roomId: String, userId: String, out: ActorRef) => {
      println(s"[New user connected] - roomId: $roomId, userId: $userId")
      var _room:ChatRoom = null
      if (rooms.contains(roomId)) {
        _room = rooms(roomId)
      } else {
        _room = new ChatRoom(roomId);
        rooms += (roomId -> _room);
      }
      if(_room != null) {
        _room.tryAddUser(userId, out)
        _room.sendMessageToAllExcept(userId, s"user-connected:$userId")
      } else {
        println(s"Could not get/create room: $roomId");
      }
    }
    case Message(message: String, roomId: String, senderUserId: String) => {
      if (rooms.contains(roomId)) {
        val _room = rooms(roomId);
        _room.sendMessageToAllExcept(senderUserId, message);
      }
    }

    case RemoveUser(roomId: String, userId: String) => {
      if (rooms.contains(roomId)) {
        val _room = rooms(roomId);
        _room.tryRemoveUser(userId);
        if (_room.users.isEmpty) {
          //If there are no more users in given room, we will remove it from the rooms collection
          rooms -= roomId
          println(s"room-removed:$roomId")
        }
      }
    }
  }
}

object StreamManager {
  case class Message(message: String, roomId: String, senderUserId: String)
  case class NewUser(roomId: String, userId: String, out: ActorRef)
  case class RemoveUser(roomId: String, userId: String)
}
