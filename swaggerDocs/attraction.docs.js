/**
 * @swagger
 * tags:
 *   name: attraction
 *   description: Endpoints to manage tourist attraction
 */

/**
 * @swagger
 * /attraction:
 *   get:
 *     summary: Get all attraction with advanced filtering, sorting, field selection, and pagination
 *     tags: [attraction]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword (matches name or description)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by fields (e.g. name,-createdAt)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Select specific fields (e.g. name,location)
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
 *         description: A list of attraction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                   example: 10
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
 *                     $ref: '#/components/schemas/Attraction'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /category/{id}/attraction:
 *   get:
 *     summary: Get all attraction for a specific category
 *     tags: [attraction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the category
 *     responses:
 *       200:
 *         description: attraction retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attraction'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /category/{id}/attraction:
 *   get:
 *     summary: Get all attraction for specefic category
 *     tags: [attraction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the category
 *     responses:
 *       200:
 *         description: attraction retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Attraction'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /attraction:
 *   post:
 *     summary: Create a new attraction
 *     tags: [attraction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttractionInput'
 *     responses:
 *       201:
 *         description: Attraction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attraction'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /attraction/{id}:
 *   put:
 *     summary: Update an existing attraction
 *     tags: [attraction]
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
 *             $ref: '#/components/schemas/AttractionInput'
 *     responses:
 *       200:
 *         description: Attraction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attraction'
 *       400:
 *         description: Invalid ID or input
 *       404:
 *         description: Attraction not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /attraction/{id}:
 *   delete:
 *     summary: Delete an attraction
 *     tags: [attraction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Attraction deleted successfully
 *       404:
 *         description: Attraction not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Attraction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6123456789abcdef01234567
 *         name:
 *           type: string
 *           example: Giza Pyramids
 *         description:
 *           type: string
 *           example: One of the Seven Wonders of the Ancient World
 *         governorate:
 *           type: string
 *           example: Giza
 *         district:
 *           type: string
 *           example: Giza City
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: Point
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               example: [31.129, 29.979]
 *         imageCover:
 *           type: string
 *           example: pyramid.jpg
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: [pyramid1.jpg, pyramid2.jpg]
 *         category:
 *           type: string
 *           example: 681f9df378ee153d354e7793
 *         ratingsAverage:
 *           type: number
 *           example: 4.5
 *         ratingsQuantity:
 *           type: number
 *           example: 120
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AttractionInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - imageCover
 *         - category
 *         - governorate
 *         - district
 *         - location
 *       properties:
 *         name:
 *           type: string
 *           example: Cairo Tower
 *         description:
 *           type: string
 *           example: A free-standing concrete tower in Cairo
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: Point
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               example: [31.2357, 30.0444]
 *         imageCover:
 *           type: string
 *           example: cairo-tower.png
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: [cairo-tower1.png, cairo-tower2.png]
 *         category:
 *           type: string
 *           example: 681f9df378ee153d354e7793
 *         governorate:
 *           type: string
 *           example: Cairo
 *         district:
 *           type: string
 *           example: Downtown Cairo
 */
