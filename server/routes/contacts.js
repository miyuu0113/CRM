const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { isAuthenticated } = require('../middleware/auth');

// 全ての取引先担当者を取得
router.get('/', isAuthenticated, contactController.getAllContacts);

// 取引先担当者詳細を取得
router.get('/:id', isAuthenticated, contactController.getContactById);

// 取引先担当者を新規作成
router.post('/', isAuthenticated, contactController.createContact);

// 取引先担当者を更新
router.put('/:id', isAuthenticated, contactController.updateContact);

// 取引先担当者を削除
router.delete('/:id', isAuthenticated, contactController.deleteContact);

module.exports = router;
