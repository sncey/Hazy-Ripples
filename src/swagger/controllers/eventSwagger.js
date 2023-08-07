/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all non-expired events
 *     description: Retrieve a list of all events.
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 */

/**
 * @swagger
 * /events/expired:
 *   get:
 *     summary: Get expired events
 *     description: Retrieve a list of expired events.
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of expired events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 */

/**
 * @swagger
 * /events/ordered:
 *   get:
 *     summary: Get events ordered by start date
 *     description: Retrieve a list of events ordered by start date.
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: order
 *         description: Order of events (nearest or furthest).
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of events ordered by start date.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input in use. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Invalid input data
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     description: Retrieve an event by its ID.
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the event to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The retrieved event.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /events/attend/{eventId}:
 *   post:
 *     tags: [Events]
 *     summary: Attend an event
 *     description: Attend an event by ID.
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to attend.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Event attendance successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: You are now attending the event
 *       400:
 *         description: User is already attending the event or event does not exist or is expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 error: You are already attending this event
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Unauthorized
 *       404:
 *         description: User not found or Event not found or has already expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 error: User not found or Event not found or has already expired
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 * securitySchemes:
 *   cookieAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 * security:
 *   - cookieAuth: []
 */

/**
 * @swagger
 * /events/unattend/{eventId}:
 *   post:
 *     tags: [Events]
 *     summary: Unattend an event
 *     description: Unattend an event by ID.
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to unattend.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Event unattendance successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: You have unattended the event
 *       400:
 *         description: User is already attending the event or event does not exist or is expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: You are not attending this event
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Unauthorized
 *       404:
 *         description: User not found or Event not found or has already expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: User not found or Event not found or has already expired
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 *
 * securitySchemes:
 *  cookieAuth:
 *   type: http
 *  scheme: bearer
 * bearerFormat: JWT
 * security:
 * - cookieAuth: []
 *
 */
/**
 * @swagger
 * /events/filter/category:
 *   get:
 *     tags: [Events]
 *     summary: Filter events by category
 *     description: Filter events by category (case-insensitive).
 *     parameters:
 *       - name: category
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Category to filter events by.
 *     responses:
 *       200:
 *         description: Successfully filtered events by category.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description:  Bad request, invalid category provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Invalid input data
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 */

/**
 * @swagger
 * /events/filter/location:
 *   get:
 *     tags: [Events]
 *     summary: Filter events by location
 *     description: Filter events by location (case-insensitive).
 *     parameters:
 *       - name: location
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Location to filter events by.
 *     responses:
 *       200:
 *         description: Successfully filtered events by location.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description:  Bad request, invalid location provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Invalid input data
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 */

/**
 * @swagger
 * /events/filter/date:
 *   get:
 *     tags: [Events]
 *     summary: Filter events by date range
 *     description: Filter events by start and end dates.
 *     parameters:
 *       - name: startDate
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the date range.
 *       - name: endDate
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date of the date range.
 *     responses:
 *       200:
 *         description: Successfully filtered events by date.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description:  Bad request, Invalid date format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Invalid input data
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Internal Server Error
 */

/**
 * @swagger
 * /events/search:
 *   get:
 *     tags: [Events]
 *     summary: Search events by query
 *     description: Search events by a query string (case-insensitive). The query will be matched against event titles, descriptions, locations, and categories.
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Query string to search events by.
 *     responses:
 *       200:
 *         description: Successfully searched events.
 *       400:
 *         description: Bad request, invalid query provided.
 *       500:
 *         description: Internal server error.
 */
