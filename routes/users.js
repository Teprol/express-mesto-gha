// eslint-disable-next-line import/no-extraneous-dependencies
const router = require('express').Router();
const {
  getUsers,
  getUserId,
  updateMeProfile,
  updateMeAvatar,
  getUserProfile,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.get('/me', getUserProfile);
router.patch('/me', updateMeProfile);
router.patch('/me/avatar', updateMeAvatar);

module.exports = router;
