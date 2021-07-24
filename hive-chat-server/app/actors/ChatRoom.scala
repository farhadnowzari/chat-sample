package actors

import akka.actor.ActorRef

class ChatRoom(roomId: String) {
  var users = Map[String, ActorRef]()
  private val _roomId = roomId

  def tryAddUser(userId: String, out: ActorRef) = {
    if (!users.contains((userId))) {
      this.users += (userId -> out)
    }
  }

  def tryRemoveUser(userId: String) = {
    if (users.contains(userId)) {
      this.users -= userId
      //We send user-disconnected to make sure 
      this.sendMessageToAllExcept(userId, s"user-disconnected:$userId")
      println(s"user-disconnected:$userId");
    }
  }

  def sendMessageToAllExcept(userId: String, message: String) = {
    for ((_userId, out) <- this.users) {
      if (_userId != userId) {
        out ! message
      }
    }
  }
}
