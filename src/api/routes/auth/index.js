import AuthController from '../../controllers/auth'

const authController = new AuthController()

export default function(app) {
  // Auth Routes
  app.route('/api/auth/getToken').post(authController.login)

  app.route('/api/auth/logout').post(authController.logout)

  app.route('/api/auth/register').post(authController.register_a_user)
}
