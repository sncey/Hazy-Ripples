// const OrganizationModel = require('../db/models/organization');
// const organizationController = {};

// organizationController.getOrganizations = async (req, res) => {
//     try {
//         const organizations = await OrganizationModel.find();
//         res.json(organizations);
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error while getting organizations',
//             error
//         });
//     }
// };

// organizationController.getOrganization = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const organization = await OrganizationModel.findById(id);
//         res.json(organization);
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error while getting organization',
//             error
//         });
//     }
// };

// organizationController.createOrganization = async (req, res) => {
//     try {
//         const organization = new OrganizationModel(req.body);
//         await organization.save();
//         res.json({
//             message: 'Organization successfully created',
//             organization
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: 'Error while creating organization',
//             error
//         });
//     }
// };

// organizationController.updateOrganization = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const organization = await 

// module.exports = organizationController;