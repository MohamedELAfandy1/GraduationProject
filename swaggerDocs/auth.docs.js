/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user and send OTP to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mohamed Elafandy
 *               email:
 *                 type: string
 *                 format: email
 *                 example: Elafandy@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 1234
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verify user with OTP
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: x-user-email
 *         schema:
 *           type: string
 *         required: true
 *         description: User's email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: '123456'
 *     responses:
 *       201:
 *         description: User verified and token issued
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Internal server error
 */
    
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: elafandy@gmail.com
 *               password:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Successfully logged in, returns access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New access token
 *       400:
 *         description: Missing user ID or invalid input
 *       401:
 *         description: Unauthorized No refresh token found
 *       403:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /auth/forgotPassword:
 *   post:
 *     summary: Send a password reset code to the user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: elafandy@example.com
 *     responses:
 *       200:
 *         description: Reset code sent to user's email
 *       400:
 *         description: User not found
 *       500:
 *         description: "Error in sending email or server error"
 */

/**
 * @swagger
 * /auth/verifyResetCode:
 *   post:
 *     summary: Verify the password reset code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passwordResetCode
 *             properties:
 *               passwordResetCode:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: "Reset code verified successfully"
 *       400:
 *         description: "Reset code invalid or expired"
 *       500:
 *         description: "Internal server error"
 */

/**
 * @swagger
 * /auth/resetPassword:
 *   put:
 *     summary: Reset password after code verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: newStrongPassword123
 *     responses:
 *       200:
 *         description: "Password reset successfully, returns new access token"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *       400:
 *         description: "User not found or reset code not verified"
 *       500:
 *         description: "Internal server error"
 */

/**
 * @swagger
 * /auth/logout:
 *   delete:
 *     summary: Logout the user and delete the refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentAccessToken
 *             properties:
 *               currentAccessToken:
 *                 type: string
 *                 example: "your_access_token_here"
 *     responses:
 *       204:
 *         description: Successfully logged out
 *       400:
 *         description: Invalid or missing access token
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects user to Google for authentication using OAuth 2.0
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google login
 */

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback handler
 *     description: Handles Google OAuth callback, returns access token and user data
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful login with token and user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6123456789abcdef01234567
 *                     name:
 *                       type: string
 *                       example: Mohamed Elafandy
 *                     email:
 *                       type: string
 *                       example: elafandy@example.com
 *       302:
 *         description: Redirect to /auth/login on failure
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 */

