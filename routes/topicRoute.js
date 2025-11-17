import express from 'express';
import * as topicController from '../controller/topicController.js';

const router = express.Router();

// Create a new topic
router.post('/', topicController.createTopic);

// Get all topics for the user
router.get('/', topicController.getAllTopics);

// Get a single topic by ID
router.get('/:id', topicController.getTopicById);

// Update a topic by ID
router.put('/:id', topicController.updateTopic);

// Delete a topic by ID
router.delete('/:id', topicController.deleteTopic);

export default router;
