/**
 * @swagger
 * /organization/signup:
 *   post:
 *     summary: Create a new organization account
 *     description: Create a new organization account with provided information.
 *     tags: [Organization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the organization.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the organization.
 *               password:
 *                 type: string
 *                 description: The password for the organization account.
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the password for the organization account.
 *               description:
 *                 type: string
 *                 description: A description of the organization.
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the organization.
 *               image:
 *                 type: string
 *                 description: URL of the organization's image.
 *             example:
 *               name: Example Org
 *               email: example@example.com
 *               password: example_password
 *               confirmPassword: example_password
 *               description: Example organization description
 *               phoneNumber: +1234567890
 *               image: http://example.com/org_image.jpg
 *     responses:
 *       200:
 *         description: Organization account created successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Organization account created successfully
 *       400:
 *         description: Invalid input or email already in use. Returns an error message in the response body.
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
 * /organization/signin:
 *   post:
 *     summary: Sign in to the organization
 *     tags:
 *       - Organization
 *     requestBody:
 *       description: Signin credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *               password:
 *                 type: string
 *               rememberMe:
 *                 type: boolean
 *             required:
 *               - emailOrUsername
 *               - password
 *     responses:
 *       '200':
 *         description: Successful signin
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: JWT token
 *       '400':
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */



/**
 * @swagger
 * /organization/updateAccount:
 *   put:
 *     summary: Update organization account
 *     description: Update the organization account information for the authenticated organization.
 *     tags: [Organization]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the organization.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email address of the organization.
 *               description:
 *                 type: string
 *                 description: The updated description of the organization.
 *               image:
 *                 type: string
 *                 description: The updated URL of the organization's image.
 *               phone_number:
 *                 type: string
 *                 description: The updated phone number of the organization.
 *             example:
 *               name: Updated Org Name
 *               email: updated@example.com
 *               description: Updated organization description
 *               image: http://example.com/updated_image.jpg
 *               phone_number: +1234567890
 *     responses:
 *       200:
 *         description: Organization account updated successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Organization account updated successfully
 *       400:
 *         description: Invalid input. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Invalid input data
 *       404:
 *         description: Organization not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Organization not found
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
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */



/**
 * @swagger
 * /organization:
 *   delete:
 *     summary: Delete organization account
 *     description: Delete the organization account for the authenticated organization.
 *     tags: [Organization]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Organization account deleted successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Organization account deleted successfully
 *       401:
 *         description: Unauthorized. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Unauthorized
 *       404:
 *         description: Organization not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Organization not found
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
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */



/**
 * @swagger
 * /organization/signOut:
 *   post:
 *     summary: Sign out from the organization account
 *     tags: [Organization]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       302:
 *         description: Redirects to the API documentation page after signing out
 *       400:
 *         description: Bad request or error while signing out
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */