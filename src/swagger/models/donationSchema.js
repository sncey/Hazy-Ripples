/**
 * @swagger
 * components:
 *   schemas:
 *     Donation:
 *       type: object
 *       required:
 *         - amount
 *         - donor
 *         - event
 *       properties:
 *         amount:
 *           type: number
 *         donor:
 *           type: string
 *           description: The ID of the donor user (refers to User schema).
 *         event:
 *           type: string
 *           description: The ID of the event (refers to Event schema).
 *         date:
 *           type: string
 *           format: date-time
 *       example:
 *         amount: 100
 *         donor: 615e429f95e77c8e4c9b98e3
 *         event: 615e42ab95e77c8e4c9b98e4
 *         date: "2023-09-25T10:30:00Z"
 */