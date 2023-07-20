const express = require('express');
const routes = express.Router();
const OrganizationController = require('../controllers/organization');
const authentication = require('../middleware/authentication');

// routes.get('/', OrganizationController.getOrganizations);
// routes.get('/:id', OrganizationController.getOrganization); //get organization by id
// routes.post('/', OrganizationController.createOrganization);
// routes.put('/:id', OrganizationController.updateOrganization);
// routes.delete('/:id', OrganizationController.deleteOrganization);

module.exports = routes;