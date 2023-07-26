/**
 * @swagger
 * tags:
 *   name: User Authentication 
 *   description: User Authentication endpoints 
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Sign up user
 *     description: Sign up a new user with the provided details.
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               firstname:
 *                 type: string
 *                 description: The first name of the user.
 *               lastname:
 *                 type: string
 *                 description: The last name of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *               confirmPassword:
 *                 type: string
 *                 description: The password confirmation. Must match the 'password' field.
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user.
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: The birthday of the user in ISO date format (YYYY-MM-DD).
 *               gender:
 *                 type: string
 *                 enum: [male, female, not-specified]
 *                 description: The gender of the user. Can be 'male', 'female', or 'not-specified'.
 *               avatar:
 *                 type: string
 *                 description: The URL of the user's avatar image.
 *             required:
 *               - username
 *               - firstname
 *               - lastname
 *               - password
 *               - confirmPassword
 *               - phoneNumber
 *               - email
 *               - birthday
 *               - gender
 *     responses:
 *       200:
 *         description: Successful sign-up. Returns the JWT token in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: JWT token.
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTVlMjI4Nzc4ZTc3YzhlNGM5Yjk4ZTMiLCJpYXQiOjE2MzA0NDMzNzksImV4cCI6MTYzMTY0MzM3OX0.6tMKuF0PGGyRjN5QrYnnqL5WPKrYi6cKys87Sn_qP4c
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
 *                 error: passwords do not match
 *       409:
 *         description: Conflict. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: john.doe@example.com already used
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
 *                 error: Internal server error
 */


/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Sign up user
 *     description: Sign up a new user with the provided details.
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               firstname:
 *                 type: string
 *                 description: The first name of the user.
 *               lastname:
 *                 type: string
 *                 description: The last name of the user.
 *               password:
 *                 type: string
 *                 description: The password for the user.
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the password for the user.
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user.
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: The birthday of the user.
 *               gender:
 *                 type: string
 *                 description: The gender of the user (e.g., "male" or "female").
 *               avatar:
 *                 type: string
 *                 description: The URL of the user's avatar image.
 *             example:
 *               username: john_doe
 *               firstname: John
 *               lastname: Doe
 *               password: password123
 *               confirmPassword: password123
 *               phoneNumber: +1234567890
 *               email: john.doe@example.com
 *               birthday: 2000-01-01
 *               gender: male
 *               avatar: https://example.com/avatar.png
 *     responses:
 *       200:
 *         description: Successful sign-up. Returns the JWT token in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: JWT token.
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTVlMjI4Nzc4ZTc3YzhlNGM5Yjk4ZTMiLCJpYXQiOjE2MzA0NDMzNzksImV4cCI6MTYzMTY0MzM3OX0.6tMKuF0PGGyRjN5QrYnnqL5WPKrYi6cKys87Sn_qP4c
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
 *                 error: passwords do not match
 *       409:
 *         description: Conflict. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: john.doe@example.com already used
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
 *                 error: Internal server error
 *
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 * security:
 *   - bearerAuth: []
 */


/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: Sign in user
 *     description: Sign in a user using their email or username along with the password.
 *     tags: [User Authentication]
 *     requestBody:
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
 *             example:
 *               emailOrUsername: john.doe@example.com
 *               password: mysecretpassword
 *               rememberMe: true
 *     responses:
 *       200:
 *         description: Successful sign-in. Returns the JWT token in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: JWT token.
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTVlMjI4Nzc4ZTc3YzhlNGM5Yjk4ZTMiLCJpYXQiOjE2MzA0NDMzNzksImV4cCI6MTYzMTY0MzM3OX0.6tMKuF0PGGyRjN5QrYnnqL5WPKrYi6cKys87Sn_qP4c
 *       400:
 *         description: Invalid credentials. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Wrong username or password
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
 *                 error: Internal server error
 */

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update user profile
 *     description: Update the profile information for the authenticated user, including password.
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the new password for the user.
 *             example:
 *               password: new_password123
 *               confirmPassword: new_password123
 *     responses:
 *       200:
 *         description: Profile updated successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: User updated successfully
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
 *                 error: passwords do not match
 *       404:
 *         description: User not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: User not found
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




