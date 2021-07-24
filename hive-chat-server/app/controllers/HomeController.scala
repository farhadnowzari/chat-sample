package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import akka.stream.Materializer
import akka.actor.ActorSystem
import play.api.libs.streams.ActorFlow
import akka.actor.Props
import actors._

@Singleton
class HomeController @Inject() (controllerComponents: ControllerComponents)(
    implicit
    system: ActorSystem,
    mat: Materializer
) extends AbstractController(controllerComponents) {

  val streamManager = system.actorOf(Props[StreamManager](), "StreamManager")

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }
  def socket(roomId: String, user: String) =
    WebSocket.accept[String, String] { request =>
      ActorFlow.actorRef { out =>
        StreamActor.props(roomId, user, streamManager, out)
      }
    }
}
