import userService from "../services/user.service.js";

class UserController {
  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userService.signIn(email, password);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async signUp(req, res, next) {
    try {
      const { email, password, username } = req.body;
      const user = await userService.signUp(email, password, username);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async changeBio(req, res, next) {
    try {
      const {userId, email, password, username } = req.body;
      const user = await userService.changeBio(userId, email, password, username);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
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
      return res.status(500).json({ message: error.message });
    }
  }
}

const userController = new UserController();
export default userController;
