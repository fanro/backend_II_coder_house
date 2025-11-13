import mongoose from 'mongoose';

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema(
  {
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    purchaser: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    amount: Number,
  },
  {
    timestamps: true,
  }
);

export const ticketsModel = mongoose.model(ticketCollection, ticketSchema);
