/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Endpoints to manage events
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events with filtering, sorting, field selection, and pagination
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword (matches title or description)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by fields (e.g. title,-createdAt)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Select specific fields (e.g. title,location)
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
 *         description: A list of events
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
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get a single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Events]
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
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid ID or input
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6123456789abcdef01234567
 *         name:
 *           type: string
 *           example: Handicraft Workshop
 *         description:
 *           type: string
 *           example: Learn traditional Egyptian crafts in this full-day workshop.
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: 2025-05-22T10:00:00Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: 2025-05-22T14:30:00Z
 *         status:
 *           type: string
 *           enum:
 *             - upcoming
 *             - finished
 *             - cancelled
 *         location:
 *           type: string
 *           example: Downtown Cairo
 *         governorate:
 *           type: string
 *           example: Cairo
 *         district:
 *           type: string
 *           example: Downtown Cairo
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: [ "workshop.jpg" ]
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           example: [ "historical" ]
 *         organizer:
 *           type: object
 *           example:
 *             name: Amr Diab
 *             contact: "010"
 *             website: "amr@insta"
 *         price:
 *           type: number
 *           example: 1000
 *         capacity:
 *           type: number
 *           example: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     EventInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - startDate
 *         - endDate
 *         - status
 *         - governorate
 *         - district
 *         - location
 *         - images
 *         - categories
 *         - organizer
 *         - price
 *         - capacity
 *       properties:
 *         name:
 *           type: string
 *           example: Handicraft Workshop
 *         description:
 *           type: string
 *           example: Learn traditional Egyptian crafts in this full-day workshop.
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: 2025-05-22T10:00:00Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: 2025-05-22T14:30:00Z
 *         status:
 *           type: string
 *           enum:
 *             - upcoming
 *             - finished
 *             - cancelled
 *         location:
 *           type: string
 *           example: Downtown Cairo
 *         governorate:
 *           type: string
 *           example: Cairo
 *         district:
 *           type: string
 *           example: Downtown Cairo
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: [ "workshop.jpg" ]
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *           example: [ "historical" ]
 *         organizer:
 *           type: object
 *           example:
 *             name: Amr Diab
 *             contact: "010"
 *             website: "amr@insta"
 *         price:
 *           type: number
 *           example: 1000
 *         capacity:
 *           type: number
 *           example: 100
 */
