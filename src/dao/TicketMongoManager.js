import { ticketsModel } from './models/ticketsModel.js';

export class TicketMongoManager {
  static async getTickets() {
    return await ticketsModel.find().lean();
  }

  static async getTicketById(id) {
    return await ticketsModel.findById(id).lean();
  }

  static async getTicketFiltro(filtro) {
    return await ticketsModel.findOne(filtro).lean();
  }

  static async createTicket(ticketData) {
    const newTicket = await ticketsModel.create(ticketData);
    return newTicket;
  }

  static async updateTicket(id, ticketData) {
    const updatedTicket = await ticketsModel.findByIdAndUpdate(id, ticketData, {
      new: true,
    });
    return updatedTicket;
  }

  static async deleteTicket(id) {
    await ticketsModel.findByIdAndDelete(id);
    return { id };
  }
}
