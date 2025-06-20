/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Endpoints to manage reviews for attractions
 */

/**
 * @swagger
 * /attraction/{attractionId}/reviews:
 *   get:
 *     summary: Get all reviews with filtering, sorting, and pagination
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: attractionId
 *         schema:
 *           type: string
 *         description: Filter reviews by attraction ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter reviews by user ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by fields (e.g. rating,-createdAt)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                   example: 5
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     numberOfPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a single review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /attraction/{attractionId}/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update an existing review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid ID or input
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 613b6a0f8f1b2c001f1a1e3d
 *         attractionId:
 *           type: string
 *           example: 6123456789abcdef01234567
 *         userId:
 *           type: string
 *           example: 609b8f9f8f9b9a001e2c3d4e
 *         rating:
 *           type: number
 *           format: float
 *           example: 4.7
 *         comment:
 *           type: string
 *           example: "Amazing place, very clean and well maintained."
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ReviewInput:
 *       type: object
 *       required:
 *         - attractionId
 *         - userId
 *         - rating
 *         - comment
 *       properties:
 *         attractionId:
 *           type: string
 *           example: 6123456789abcdef01234567
 *         userId:
 *           type: string
 *           example: 609b8f9f8f9b9a001e2c3d4e
 *         rating:
 *           type: number
 *           format: float
 *           example: 4.5
 *         comment:
 *           type: string
 *           example: "Great experience, would visit again."
 */
