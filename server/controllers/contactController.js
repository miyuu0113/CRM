const Contact = require('../models/Contact');

async function getAllContacts(req, res) {
    try {
        const contacts = await Contact.findAll();
        res.json(contacts);
    } catch (error) {
        console.error('Get all contacts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getContactById(req, res) {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createContact(req, res) {
    try {
        const { company_id, full_name } = req.body;

        if (!company_id || !full_name) {
            return res.status(400).json({ error: 'Company ID and full name are required' });
        }

        const contactId = await Contact.create(req.body);
        const contact = await Contact.findById(contactId);
        res.status(201).json(contact);
    } catch (error) {
        console.error('Create contact error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateContact(req, res) {
    try {
        const { full_name } = req.body;

        if (!full_name) {
            return res.status(400).json({ error: 'Full name is required' });
        }

        await Contact.update(req.params.id, req.body);
        const contact = await Contact.findById(req.params.id);
        res.json(contact);
    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteContact(req, res) {
    try {
        await Contact.delete(req.params.id);
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};
