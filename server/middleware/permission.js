const Company = require('../models/Company');
const ActivityLog = require('../models/ActivityLog');

async function checkCompanyPermission(req, res, next) {
    try {
        const companyId = req.params.id || req.params.companyId;
        const userId = req.session.userId;
        const userRole = req.session.role;

        // 管理者は全て許可
        if (userRole === 'admin') {
            return next();
        }

        // 担当者かどうかチェック
        const isAssigned = await Company.isUserAssigned(companyId, userId);
        if (isAssigned) {
            return next();
        }

        res.status(403).json({ error: 'Forbidden: Not assigned to this company' });
    } catch (error) {
        console.error('Permission check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function checkActivityPermission(req, res, next) {
    try {
        const activityId = req.params.id;
        const userId = req.session.userId;
        const userRole = req.session.role;

        // 管理者は全て許可
        if (userRole === 'admin') {
            return next();
        }

        // 作成者かどうかチェック
        const activity = await ActivityLog.findById(activityId);
        if (activity && activity.user_id === userId) {
            return next();
        }

        res.status(403).json({ error: 'Forbidden: Not the creator of this activity' });
    } catch (error) {
        console.error('Permission check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    checkCompanyPermission,
    checkActivityPermission
};
