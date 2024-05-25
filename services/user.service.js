import UserModel from "../models/user.model.js";
import randomstring from "randomstring";
import bcrypt from "bcrypt";
import moment from "moment";

const subscriptions = {
  "1_month": "1 Month",
  "3_months": "3 Months",
  "1_year": "1 Year",
};

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
      entranceCode: user.entranceCode,
      subscriptionExpiredAt: user.subscriptionExpiredAt,
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

  async refreshData(userId) {
    const user = await UserModel.findOne({ _id: userId }).lean();
    if (!user) {
      throw new Error("User not found");
    }
    return {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscription: user.subscription,
      entranceCode: user.entranceCode,
      subscriptionExpiredAt: user.subscriptionExpiredAt,
    };
  }

  async changeBio(userId, email, password, name) {
    const user = await UserModel.findOne({ _id: userId }).lean();
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    let fieldsToSet = {};
    if (!!email?.trim() && user.email !== email) {
      const userExists = await UserModel.findOne({ email: email }).lean();
      if (userExists) {
        throw new Error(`User with email ${email} already exists`);
      }
      fieldsToSet.email = email;
    }
    if (!!password?.trim()) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (!isSamePassword) {
        const hashedPassword = await bcrypt.hash(password, 3);
        fieldsToSet.password = hashedPassword;
      }
    }
    if (!!name.trim() && user.name !== name) {
      fieldsToSet.name = name;
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: fieldsToSet,
      },
      { returnDocument: 1 }
    );

    return {
      userId: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      entranceCode: updatedUser.entranceCode,
      subscription: updatedUser.subscription,
      subscriptionExpiredAt: updatedUser.subscriptionExpiredAt,
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
    if (!userExists) {
      throw new Error(`User with id ${userId} not exists`);
    }
    const subscriptionSplited = subscription.split("_");
    const subscriptionExpiredAt = moment().add(
      subscriptionSplited[0],
      subscriptionSplited[1]
    );
    const entranceCode = randomstring.generate(16);

    await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          entranceCode: entranceCode,
          subscription: subscription,
          subscriptionExpiredAt: subscriptionExpiredAt,
        },
      }
    );

    return {
      entranceCode: entranceCode,
      subscription: subscription,
      subscriptionExpiredAt: subscriptionExpiredAt,
    };
  }

  async getSubscriptionStats() {
    const users = await UserModel.aggregate([
      { $match: { role: { $ne: "admin" } } },
      {
        $group: {
          _id: "$subscription",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: "$_id",
          count: "$count",
        },
      },
    ]);
    const usersCount = users.reduce((acc, user) => acc + user.count, 0);

    const userSubscriptionStats = users.map((user) => ({
      id: subscriptions[user._id] || "Without",
      value: ((user.count / usersCount) * 100).toFixed(2),
      label: subscriptions[user._id] || "Without",
    }));
    return userSubscriptionStats;
  }
}

const userService = new UserService();
export default userService;
