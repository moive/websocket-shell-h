import { Request, Response } from "express";
import { TicketService } from "../services";

export class TicketsController {
  // DI - WsService
  constructor(private readonly ticketService = new TicketService()) {}

  public getTickets = async (req: Request, res: Response) => {
    res.json(this.ticketService.tickets);
  };

  public getLastTicketNumber = async (req: Request, res: Response) => {
    res.json(this.ticketService.lastTicketNumber);
  };
  public pendingTickets = async (req: Request, res: Response) => {
    res.json(this.ticketService.pendingTickets);
  };
  public createTicket = async (req: Request, res: Response) => {
    res.status(201).json(this.ticketService.createTicket());
  };
  public drawTicket = async (req: Request, res: Response) => {
    const { desk } = req.params;
    if (!desk || Array.isArray(desk)) {
      return res.status(400).json({ error: "Desk parameter is required" });
    }
    res.json(this.ticketService.drawTicket(desk));
  };
  public ticketFinished = async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    if (!ticketId || Array.isArray(ticketId)) {
      return res.status(400).json({ error: "ticketId parameter is required" });
    }

    res.json(this.ticketService.onFinishedTicket(ticketId));
  };
  public workingOn = async (req: Request, res: Response) => {
    res.json(this.ticketService.lastWorkingOnTickets);
  };
}
