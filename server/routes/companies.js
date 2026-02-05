const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { isAuthenticated, requireAdmin } = require('../middleware/auth');
const { checkCompanyPermission } = require('../middleware/permission');

// 全ての法人を取得（全ユーザー閲覧可能）
router.get('/', isAuthenticated, companyController.getAllCompanies);

// 法人詳細を取得（全ユーザー閲覧可能）
router.get('/:id', isAuthenticated, companyController.getCompanyById);

// 法人を新規作成
router.post('/', isAuthenticated, companyController.createCompany);

// 法人を更新（担当者または管理者のみ）
router.put('/:id', isAuthenticated, checkCompanyPermission, companyController.updateCompany);

// 法人を削除（管理者のみ）
router.delete('/:id', isAuthenticated, requireAdmin, companyController.deleteCompany);

// 法人の取引先担当者を取得
router.get('/:id/contacts', isAuthenticated, companyController.getCompanyContacts);

// 法人の当方担当者を取得
router.get('/:id/users', isAuthenticated, companyController.getCompanyUsers);

// 法人に当方担当者を割り当て（担当者または管理者のみ）
router.post('/:id/users', isAuthenticated, checkCompanyPermission, companyController.assignUserToCompany);

// 法人から当方担当者の割り当てを解除（担当者または管理者のみ）
router.delete('/:id/users/:userId', isAuthenticated, checkCompanyPermission, companyController.unassignUserFromCompany);

module.exports = router;
