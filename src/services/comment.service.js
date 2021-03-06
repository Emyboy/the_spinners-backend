import models from '../models';

const { Comments } = models;

/**
 * class of different comments
*/
class CommentService {
  /**
   * @param {newComment} newComment
   * @returns {create} this function creates comment
  */
  static createComment(newComment) {
    return Comments.create(newComment);
  }

  /**
   * @param {number} property
   * @returns {find} this function finds comment
  */
  static findCommentByProperty(property) {
    return Comments.findOne({
      where: property
    });
  }

  /**
   * @param {object} property
   * @returns {delete} this function deletes comment
  */
  static deleteCommentByProperty(property) {
    return Comments.destroy({
      where: property,
    });
  }
}

export default CommentService;
