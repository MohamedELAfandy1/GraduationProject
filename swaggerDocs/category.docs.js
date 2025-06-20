/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Endpoints to manage product categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories with advanced filtering, sorting, field selection, and pagination
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword (matches name, title, or description)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by fields (e.g. name,-createdAt)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Select specific fields (e.g. name,createdAt)
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
 *       - in: query
 *         name: [filter]
 *         schema:
 *           type: string
 *         description: Filter by field value. Use operators like `field[gte]=10`
 *     responses:
 *       200:
 *         description: A list of categories with pagination metadata
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
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     numberOfPages:
 *                       type: integer
 *                       example: 3
 *                     next:
 *                       type: integer
 *                       example: 2
 *                     previous:
 *                       type: integer
 *                       example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 */
/** 
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category (must be a valid MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid Category ID Format
 *       404:
 *         description: No category found with the given ID
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid ID or input
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6123456789abcdef01234567
 *         name:
 *           type: string
 *           example: Furniture
 *         description:
 *           type: string
 *           example: Furniture is a good example for categories
 *         image:
 *           type: string
 *           example: category-4d2cd8a2-d928-455f-a5ab-7d30d545918c-1746595741030.jpeg
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Electronics
 *         description:
 *           type: string
 *           example: Electronics is a good example for categories
 *         image:
 *           type: string
 *           example: Uplod your image iker
 */
