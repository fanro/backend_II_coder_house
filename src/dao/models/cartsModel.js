import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const schemaCart = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

schemaCart.plugin(paginate);
export const cartsModel = mongoose.model('carts', schemaCart);
