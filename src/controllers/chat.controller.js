import { Op } from 'sequelize';
import { users, io } from '../helpers/eventEmmiters/socket';
import ResponseService from '../services/response.service';
import ChatService from '../services/chat.service';
import UserService from '../services/user.service';

/** Class representing comments controller. */
class ChatController {
  /**
   * Save a new message.
   * @param {object} req request
   * @param {object} res response
   * @returns {object} response object
   */
  static async saveMessage(req, res) {
    const newMessage = await ChatService.saveMessage({ ...req.body, sender: req.userData.email });
    ChatService.sendMessage(req.body.receiver, req.userData.email, req.body.message);

    ResponseService.setSuccess(200, 'message added successfully', newMessage);
    ResponseService.send(res);
  }

  /**
   * gets all messages for a user
   * @param {object} req request
   * @param {object} res response
   * @returns {object} response
   */
  static async getMessages(req, res) {
    const message = await ChatService.getMessages({
      [Op.or]: [{ receiver: req.userData.email }, { sender: req.userData.email }]
    });

    ResponseService.setSuccess(200, 'messages fetched successfully', message);
    ResponseService.send(res);
  }

  /**
   * gets all messages for a user
   * @param {object} req request
   * @param {object} res response
   * @returns {object} response
   */
  static async getAllUsers(req, res) {
    const allUsers = await UserService.getAllUsers();


    const chatUsers = allUsers.map((user) => {
      const chatUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture
      };

      const onlineUser = users[user.email];

      if (onlineUser) {
        chatUser.isOnline = true;
        return chatUser;
      }
      chatUser.isOnline = false;
      return chatUser;
    });

    const sortedUsers = chatUsers.sort((a, b) => a.isOnline.toString()
      .localeCompare(b.isOnline.toString())).reverse();

    io.emit('updateUsersList', sortedUsers);

    ResponseService.setSuccess(200, 'All users', sortedUsers);
    return ResponseService.send(res);
  }

  /**
   * @param {object} req request
   * @param {object} res response
   * @return {function} requests
   */
  static async markAllAsRead(req, res) {
    await ChatService.updateMessages(
      { isRead: true },
      { receiver: req.userData.email }
    );
    ResponseService.setSuccess(200, 'Messages successfully marked as read');
    return ResponseService.send(res);
  }
}

export default ChatController;
