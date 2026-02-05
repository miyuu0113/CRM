const Company = require('../models/Company');
const Contact = require('../models/Contact');

async function getAllCompanies(req, res) {
    try {
        const companies = await Company.findAll();
        res.json(companies);
    } catch (error) {
        console.error('Get all companies error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getCompanyById(req, res) {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        console.error('Get company error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createCompany(req, res) {
    try {
        const { company_name } = req.body;

        if (!company_name) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        const companyId = await Company.create(req.body, req.session.userId);

        // 作成者を自動的に担当者として割り当て
        await Company.assignUser(companyId, req.session.userId);

        const company = await Company.findById(companyId);
        res.status(201).json(company);
    } catch (error) {
        console.error('Create company error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateCompany(req, res) {
    try {
        const { company_name } = req.body;

        if (!company_name) {
            return res.status(400).json({ error: 'Company name is required' });
        }

        await Company.update(req.params.id, req.body);
        const company = await Company.findById(req.params.id);
        res.json(company);
    } catch (error) {
        console.error('Update company error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteCompany(req, res) {
    try {
        await Company.delete(req.params.id);
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        console.error('Delete company error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getCompanyContacts(req, res) {
    try {
        const contacts = await Contact.findByCompany(req.params.id);
        res.json(contacts);
    } catch (error) {
        console.error('Get company contacts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getCompanyUsers(req, res) {
    try {
        const users = await Company.getAssignedUsers(req.params.id);
        res.json(users);
    } catch (error) {
        console.error('Get company users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function assignUserToCompany(req, res) {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        await Company.assignUser(req.params.id, user_id);
        const users = await Company.getAssignedUsers(req.params.id);
        res.json(users);
    } catch (error) {
        console.error('Assign user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function unassignUserFromCompany(req, res) {
    try {
        await Company.unassignUser(req.params.id, req.params.userId);
        const users = await Company.getAssignedUsers(req.params.id);
        res.json(users);
    } catch (error) {
        console.error('Unassign user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyContacts,
    getCompanyUsers,
    assignUserToCompany,
    unassignUserFromCompany
};
