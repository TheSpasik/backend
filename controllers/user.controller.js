import userService from "../services/user.service.js";

class UserController {
  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userService.signIn(email, password);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async signUp(req, res, next) {
    try {
      const { email, password, username } = req.body;
      const user = await userService.signUp(email, password, username);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async changeBio(req, res, next) {
    try {
      const {userId, email, password, username } = req.body;
      const user = await userService.changeBio(userId, email, password, username);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async changeSubscription(req, res, next) {
    try {
      const { userId, subscription, cardNumber, cardDate, cardCVV } = req.body;
      const response = await userService.changeSubscription(
        userId,
        subscription,
        cardNumber,
        cardDate,
        cardCVV
      );
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();
export default userController;
