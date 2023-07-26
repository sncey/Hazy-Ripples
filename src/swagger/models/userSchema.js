/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - firstname
 *         - lastname
 *         - email
 *         - phoneNumber
 *         - birthday
 *         - gender
 *       properties:
 *         username:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: number
 *         birthday:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [male, female, not-specified]
 *       example:
 *         username: john_doe
 *         firstname: John
 *         lastname: Doe
 *         email: john.doe@example.com
 *         phoneNumber: 1234567890
 *         birthday: "1990-01-01"
 *         gender: male
 */
