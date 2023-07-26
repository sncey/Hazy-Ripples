/**
 * @swagger
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         events:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of event IDs associated with the organization.
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         image:
 *           type: string
 *         phone_number:
 *           type: string
 *         rating:
 *           type: number
 *       example:
 *         name: My Organization
 *         email: organization@example.com
 *         events: []
 *         description: This is a sample organization.
 *         created_at: "2023-07-24T12:34:56Z"
 *         image: https://example.com/image.jpg
 *         phone_number: "+1234567890"
 *         rating: 4.5
 */
