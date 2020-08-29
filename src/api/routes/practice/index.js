
import isAuthenticated from '../../handlers/authHandler'
import practiceController from '../../controllers/practice'

export default function(app) {
  app.route('/api/practice')
    .get(
      isAuthenticated.user,
      practiceController.getTodayPractice
    )

  app.route('/api/practice')
    .put(
      isAuthenticated.user,
      practiceController.check
    )
}
