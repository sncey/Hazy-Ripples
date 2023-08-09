/**
 * @swagger
 * tags:
 *   name: User 
 *   description: User Authentication and Interactivivty endpoints 
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Sign up user
 *     description: Sign up a new user with the provided details.
 *     tags: [User]
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
 * /user/signin:
 *   post:
 *     summary: Sign in user
 *     description: Sign in a user using their email or username along with the password.
 *     tags: [User]
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
 *               phoneNumber:
 *                 type: string
 *                 description: The new phone number for the user.
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: The new birthday for the user (YYYY-MM-DD).
 *               username:
 *                 type: string
 *                 description: The new username for the user.
 *               firstname:
 *                 type: string
 *                 description: The new first name for the user.
 *               lastname:
 *                 type: string
 *                 description: The new last name for the user.
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: The new gender for the user.
 *               avatar:
 *                 type: string
 *                 description: The new avatar URL for the user.
 *             example:
 *               password: new_password123
 *               confirmPassword: new_password123
 *               phoneNumber: +1234567890
 *               birthday: 1990-01-01
 *               username: john_doe
 *               firstname: John
 *               lastname: Doe
 *               gender: male
 *               avatar: https://example.com/avatar.jpg
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
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 * security:
 *   - cookieAuth: []
 */




/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete user profile
 *     description: Delete the profile of the authenticated user.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully. Redirects to the API documentation page.
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
 *       422:
 *         description: User not found or Blog post not found. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Blog post not found
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
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */ 




/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Fetch a user by their ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to fetch.
 *     responses:
 *       200:
 *         description: User found. Returns the user data in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *                 message:
 *                   type: string
 *               example:
 *                 message: Error while fetching user
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the user.
 *         username:
 *           type: string
 *           description: The username of the user.
 *         firstname:
 *           type: string
 *           description: The first name of the user.
 *         lastname:
 *           type: string
 *           description: The last name of the user.
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the user.
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         birthday:
 *           type: string
 *           format: date
 *           description: The birthday of the user (YYYY-MM-DD).
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: The gender of the user.
 *         avatar:
 *           type: string
 *           description: The avatar URL of the user.
 *       example:
 *         _id: 615e228778e77c8e4c9b98e3
 *         username: john_doe
 *         firstname: John
 *         lastname: Doe
 *         phoneNumber: +1234567890
 *         email: john.doe@example.com
 *         birthday: 1990-01-01
 *         gender: male
 *         avatar: https://example.com/avatar.jpg
 */




/**
 * @swagger
 * /user/signout:
 *   post:
 *     summary: Sign out user
 *     description: Sign out the authenticated user by clearing the JWT cookie.
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       302:
 *         description: Successfully signed out. Redirects to the API documentation page.
 *       400:
 *         description: Bad request. Returns an error message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: Bad request
 * 
 * securitySchemes:
 *   cookieAuth:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 */




/**
 * @swagger
 * /user/forgotPassword:
 *   get:
 *     summary: Forgot Password
 *     description: Send a forgot password email to the user's registered email address.
 *     tags: [Development]
 *     responses:
 *       200:
 *         description: Forgot password email sent successfully. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Forgot password email sent successfully. Please check your email.
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
 *                 error: Invalid email address.
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
 * /user/resetPassword:
 *   put:
 *     summary: Reset Password
 *     description: Reset the user's password using the provided reset token.
 *     tags: [Development]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: The reset token received in the email.
 *               newPassword:
 *                 type: string
 *                 description: The new password to set.
 *               confirmNewPassword:
 *                 type: string
 *                 description: Confirm the new password.
 *             example:
 *               resetToken: YOUR_RESET_TOKEN
 *               newPassword: new_password123
 *               confirmNewPassword: new_password123
 *     responses:
 *       200:
 *         description: Password reset successful. Returns a success message in the response body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Password reset successful. You can now login with your new password.
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
 *                 error: Passwords do not match.
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
 */
