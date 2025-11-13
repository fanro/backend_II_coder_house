import mongoose from 'mongoose';

const ticketCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  purchaser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  items: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
});

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);
