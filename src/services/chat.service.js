import models from '../models';
import { users } from '../helpers/eventEmmiters/socket';

const { Chat } = models;

/**
 * @class ChatService
 */
export default class ChatService {
  /**
   * @static
   * @param {*} message
   * @memberof ChatService
   * @return {message} new message
   */
  static async saveMessage(message) {
    return Chat.create(message);
  }

  /**
   * Get messages.
   * @param {object} param notification
   * @returns {object} The notification object.
   */
  static async getMessages(param) {
    const results = await Chat.findAll({
      where: param,
      order: [['isRead', 'ASC'], ['createdAt', 'ASC']]
    });

    const unread = await Chat.count({
      where: {
        ...param,
        isRead: false
      }
    });
    return {
      unread,
      messages: results
    };
  }

  /**
   * @param {object} receiver
   * @param {object} sender
   * @param {object} message
   * @return {function} send notification to connected client
   */
  static async sendMessage(receiver, sender, message) {
    if (!users[receiver]) return 0;
    users[receiver].emit('private message', { sender, message });
  }

  /**
   * Mark as read messages
   * @param {object} userInfo user messages
   * @param {object} user user
   * @returns {object} The message object.
   */
  static updateMessages(userInfo, user) {
    return Chat.update(userInfo, {
      where: user
    });
  }
}
