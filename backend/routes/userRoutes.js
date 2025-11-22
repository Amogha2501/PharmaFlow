const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus
} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Protected routes (admin only)
router.get('/', authenticateToken, checkRole(['admin']), getAllUsers);
router.get('/:id', authenticateToken, checkRole(['admin']), getUserById);
router.post('/', authenticateToken, checkRole(['admin']), createUser);
router.put('/:id', authenticateToken, checkRole(['admin']), updateUser);
router.delete('/:id', authenticateToken, checkRole(['admin']), deleteUser);
router.patch('/:id/toggle-status', authenticateToken, checkRole(['admin']), toggleUserStatus);

module.exports = router;