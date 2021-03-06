import ResponseService from '../services/response.service';
import UserService from '../services/user.service';
/**
 *
 *
 * @class SettingsController
 */
class SettingsController {
  /**
  * super_admin can assign a role to user by email
  * @static
  * @description PATCH /api/admin/reset-user-role
  * @param {object} req request object
  * @param {object} res response object
  * @memberof UserRoleSettingsController
  * @returns {object} ResponseService
  */
  static async changeUserRole(req, res) {
    const { userEmail, userRole } = req.body;
    const findUser = await UserService.findUserByProperty({ email: userEmail.trim() });
    if (findUser && findUser.role !== 'super_admin') {
      await UserService.updateUser({ email: userEmail.trim() }, { role: userRole.trim() });
      ResponseService.setSuccess(200, 'User role successfully updated', { role: userRole });
      ResponseService.send(res);
    } else {
      ResponseService.setError(404, `User role not updated. ${userEmail.trim()} is either a super admin or Not Registered`);
      ResponseService.send(res);
    }
  }

  /**
   * @param {req} req
   * @param {res} res
   * @returns {response} @memberof SettingsController
  */
  static async assignRequesterToManager(req, res) {
    const { userId } = req.params;
    const { lineManagerId } = req.body;
    const [, [{ dataValues }]] = await UserService.updateUser({ id: userId }, { lineManagerId });
    ResponseService.setSuccess(200, 'Requester is successfully assigned to a manager', { lineManagerId: dataValues.lineManagerId });
    ResponseService.send(res);
  }
}
export default SettingsController;
