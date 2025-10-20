import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const schemaProduct = new mongoose.Schema(
  {
    title: String,
    description: String,
    code: {
      type: String,
      unique: true,
    },
    price: Number,
    stock: {
      type: Number,
      default: 0,
    },
    descrip: String,
  },
  {
    timestamps: true,
    //strict: true, default true, para que no guarde campos no definidos en el schema
    // collection: 'productos',
  }
);

schemaProduct.plugin(paginate);
export const productsModel = mongoose.model('products', schemaProduct);
