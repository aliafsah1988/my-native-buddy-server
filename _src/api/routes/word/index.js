
import isAuthenticated from '../../handlers/authHandler'
import wordController from '../../controllers/word'

export default function(app) {
  // Word Routes

  app.route('/api/word/getByUserId')
    .get(
      isAuthenticated.superAdmin,
      wordController.getByUserId
    )

  app.route('/api/word')
    .get(
      isAuthenticated.user,
      wordController.getById
    )

  app.route('/api/word')
    .post(
      isAuthenticated.user,
      wordController.create
    )

  app.route('/api/word')
    .put(
      isAuthenticated.user,
      wordController.update
    )

  app.route('/api/word')
    .delete(
      isAuthenticated.user,
      wordController.delete
    )

  app.route('/api/word/user')
    .get(
      isAuthenticated.user,
      wordController.getMyWords
    )
}
