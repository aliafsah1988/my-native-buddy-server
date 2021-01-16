
import isAuthenticated from '../../handlers/authHandler'
import userController from '../../controllers/user'

export default function (app) {
  // User Routes
  app.route('/api/user/getAll')
    .get(
      isAuthenticated.superAdmin,
      userController.getAll
    )

  app.route('/api/user')
    .get(
      isAuthenticated.superAdmin,
      userController.getById
    )

  app.route('/api/user')
    .put(
      isAuthenticated.superAdmin,
      userController.update
    )

  app.route('/api/user')
    .delete(
      isAuthenticated.superAdmin,
      userController.delete
    )
}
