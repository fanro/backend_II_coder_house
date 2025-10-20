import { usersModel } from './models/usersModel.js';
export class UserMongoManager {
  static async getUsers() {
    return await usersModel.find().lean();
  }

  static async getUserById(id) {
    return await usersModel.findById(id).lean();
  }

  static async createUser(userData) {
    const newUser = await usersModel.create(userData);
    return newUser;
  }

  static async updateUser(id, userData) {
    const updatedUser = await usersModel.findByIdAndUpdate(id, userData, {
      new: true,
    });
    return updatedUser;
  }

  static async deleteUser(id) {
    await usersModel.findByIdAndDelete(id);
    return { id };
  }
}
