const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, requireAdmin } = require('../middleware/auth');

// 全てのユーザーを取得（管理者のみ）
router.get('/', isAuthenticated, requireAdmin, userController.getAllUsers);

// ユーザー詳細を取得（管理者のみ）
router.get('/:id', isAuthenticated, requireAdmin, userController.getUserById);

// ユーザーを新規作成（管理者のみ）
router.post('/', isAuthenticated, requireAdmin, userController.createUser);

// ユーザーを更新（管理者のみ）
router.put('/:id', isAuthenticated, requireAdmin, userController.updateUser);

// ユーザーを削除（管理者のみ）
router.delete('/:id', isAuthenticated, requireAdmin, userController.deleteUser);

module.exports = router;
