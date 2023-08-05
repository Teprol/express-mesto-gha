// eslint-disable-next-line import/no-extraneous-dependencies
const router = require('express').Router();
const {
  getUsers,
  getUserId,
  createUser,
  updateMeProfile,
  updateMeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me', updateMeProfile);
router.patch('/me/avatar', updateMeAvatar);

module.exports = router;
