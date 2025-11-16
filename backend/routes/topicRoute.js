const express = require('express');
const router = express.Router();
const topicController = require('../controller/topicController.js');

// All routes here are protected by the authMiddleware, which is applied in index.js

// Create a new topic
router.post('/', topicController.createTopic);

// Get all topics for the user
router.get('/', topicController.getAllTopics);

// Update a topic by ID
router.put('/:id', topicController.updateTopic);

// Delete a topic by ID
router.delete('/:id', topicController.deleteTopic);

module.exports = router;
