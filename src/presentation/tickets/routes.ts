import { Router } from "express";
import { TicketsController } from "./controller";

export class TicketRoutes {
  static get routes(): Router {
    const router = Router();
    const ticketController = new TicketsController();

    router.get("/", ticketController.getTickets);
    router.get("/last", ticketController.getLastTicketNumber);
    router.get("/pending", ticketController.pendingTickets);

    router.post("/", ticketController.createTicket);

    router.get("/draw/:desk", ticketController.drawTicket);
    router.put("/done/:ticketId", ticketController.ticketFinished);

    router.get("/working-on", ticketController.workingOn);

    return router;
  }
}
