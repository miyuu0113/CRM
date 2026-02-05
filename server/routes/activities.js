const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { isAuthenticated } = require('../middleware/auth');
const { checkActivityPermission } = require('../middleware/permission');

// 全ての活動ログを取得（クエリパラメータでフィルタ可能）
router.get('/', isAuthenticated, activityController.getAllActivities);

// 今後のネクストアクション取得
router.get('/upcoming', isAuthenticated, activityController.getUpcomingActions);

// 特定法人の活動ログを取得
router.get('/company/:companyId', isAuthenticated, activityController.getActivitiesByCompany);

// 活動ログ詳細を取得
router.get('/:id', isAuthenticated, activityController.getActivityById);

// 活動ログを新規作成
router.post('/', isAuthenticated, activityController.createActivity);

// 活動ログを更新（作成者または管理者のみ）
router.put('/:id', isAuthenticated, checkActivityPermission, activityController.updateActivity);

// 活動ログを削除（作成者または管理者のみ）
router.delete('/:id', isAuthenticated, checkActivityPermission, activityController.deleteActivity);

module.exports = router;
