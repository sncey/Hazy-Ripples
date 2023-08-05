/**
 * @swagger
 * /donation:
 *   get:
 *     summary: Get donations
 *     description: Get donations associated with the authenticated user.
 *     tags: [Donation]
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Returns a list of donations associated with the authenticated user.
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Donation"
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Unauthorized
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Internal Server Error
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */



/**
 * @swagger
 * /donation/{id}:
 *   get:
 *     summary: Get a donation
 *     description: Get a specific donation associated with the authenticated user.
 *     tags: [Donation]
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the donation to retrieve.
 *     responses:
 *       200:
 *         description: Returns the details of the specified donation associated with the authenticated user.
 *         schema:
 *           $ref: "#/definitions/Donation"
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Unauthorized
 *       404:
 *         description: Donation not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Donation not found
 *       500:
 *         description: Internal server error. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Internal Server Error
 *
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */
