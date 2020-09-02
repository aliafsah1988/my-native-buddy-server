
import isAuthenticated from '../../handlers/authHandler'
import LangController from '../../controllers/lang'

export default function(app) {
  // Lang Routes
  const langController = new LangController()

  app.route('/api/lang/list')
    .get(
      isAuthenticated.user,
      langController.getList
    )
}
