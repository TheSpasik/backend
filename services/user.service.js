import UserModel from "../models/user.model.js";
import randomstring from "randomstring";
import bcrypt from "bcrypt";

class UserService {
  async signIn(email, password) {
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      throw new Error("Incorrect password");
    }
    return {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscription: user.subscription,
    };
  }

  async signUp(email, password, name) {
    const userExists = await UserModel.findOne({ email: email }).lean();
    if (userExists) {
      throw new Error(`User with email ${email} already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, 3);

    const userId = randomstring.generate(16);
    const newUser = await UserModel.create({
      _id: userId,
      email: email,
      name: name,
      password: hashedPassword,
    });

    return {
      userId: userId,
      email: email,
      name: name,
    };
  }

  async changeSubscription(
    userId,
    subscription,
    cardNumber,
    cardDate,
    cardCVV
  ) {
    const userExists = await UserModel.findOne({ _id: userId }).lean();
    if (userExists) {
      throw new Error(`User with id ${userId} already exists`);
    }

    await UserModel.updateOne(
      { _id: userId },
      { $set: { subscription: subscription } }
    );

    return {
      subscription: subscription,
    };
  }
}

const userService = new UserService();
export default userService;
