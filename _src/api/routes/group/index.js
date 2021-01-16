
import isAuthenticated from '../../handlers/authHandler'
import GroupController from '../../controllers/group'

export default function(app) {
  // Group Routes
  const groupController = new GroupController()

  app.route('/api/group/getByUserId')
    .get(
      isAuthenticated.superAdmin,
      groupController.getByUserId
    )

  app.route('/api/group')
    .get(
      isAuthenticated.user,
      groupController.getById
    )

  app.route('/api/group')
    .post(
      isAuthenticated.user,
      groupController.create
    )

  app.route('/api/group')
    .put(
      isAuthenticated.user,
      groupController.update
    )

  app.route('/api/group')
    .delete(
      isAuthenticated.user,
      groupController.delete
    )

  app.route('/api/group/user')
    .get(
      isAuthenticated.user,
      groupController.getMyGroups
    )
}
