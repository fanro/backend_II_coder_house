import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const schemaUser = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: Number,
    password: String,
    role: {
      type: String,
      default: 'user',
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carts',
    },
  },
  {
    timestamps: true,
  }
);

schemaUser.plugin(paginate);
export const usersModel = mongoose.model('users', schemaUser);
