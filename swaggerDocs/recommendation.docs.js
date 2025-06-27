/**
 * @swagger
 * /recommendations:
 *   get:
 *     summary: Get recommended attractions for the logged-in user
 *     tags: [Attractions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recommended attractions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attraction'
 *       401:
 *         description: Unauthorized - User not authenticated
 *       500:
 *         description: Internal server error
 */
