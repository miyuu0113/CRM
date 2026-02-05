const ActivityLog = require('../models/ActivityLog');

async function getAllActivities(req, res) {
    try {
        const filters = {};
        if (req.query.company_id) filters.company_id = req.query.company_id;
        if (req.query.user_id) filters.user_id = req.query.user_id;

        const activities = await ActivityLog.findAll(filters);
        res.json(activities);
    } catch (error) {
        console.error('Get all activities error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getActivityById(req, res) {
    try {
        const activity = await ActivityLog.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json(activity);
    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getActivitiesByCompany(req, res) {
    try {
        const activities = await ActivityLog.findByCompany(req.params.companyId);
        res.json(activities);
    } catch (error) {
        console.error('Get company activities error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createActivity(req, res) {
    try {
        const { company_id, activity_type, subject, activity_date } = req.body;

        if (!company_id || !activity_type || !subject || !activity_date) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        const activityId = await ActivityLog.create(req.body, req.session.userId);
        const activity = await ActivityLog.findById(activityId);
        res.status(201).json(activity);
    } catch (error) {
        console.error('Create activity error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateActivity(req, res) {
    try {
        const { activity_type, subject, activity_date } = req.body;

        if (!activity_type || !subject || !activity_date) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        await ActivityLog.update(req.params.id, req.body);
        const activity = await ActivityLog.findById(req.params.id);
        res.json(activity);
    } catch (error) {
        console.error('Update activity error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteActivity(req, res) {
    try {
        await ActivityLog.delete(req.params.id);
        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Delete activity error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getUpcomingActions(req, res) {
    try {
        const actions = await ActivityLog.getUpcomingActions();
        res.json(actions);
    } catch (error) {
        console.error('Get upcoming actions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllActivities,
    getActivityById,
    getActivitiesByCompany,
    createActivity,
    updateActivity,
    deleteActivity,
    getUpcomingActions
};
