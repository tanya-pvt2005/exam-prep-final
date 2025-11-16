const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Create a new topic
exports.createTopic = async (req, res) => {
    try {
        const { title, notes } = req.body;
        const userId = req.user.id; // user ID from the authenticated request

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const newTopic = await prisma.topic.create({
            data: {
                title,
                notes,
                user: {
                    connect: {
                        id: parseInt(userId)
                    }
                }
            }
        });

        res.status(201).json(newTopic);
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all topics for a specific user
exports.getAllTopics = async (req, res) => {
    try {
        const userId = req.user.id;

        const topics = await prisma.topic.findMany({
            where: {
                userId: parseInt(userId)
            }
        });

        res.status(200).json(topics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a topic
exports.updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, notes } = req.body;
        const userId = req.user.id;

        const updatedTopic = await prisma.topic.updateMany({
            where: {
                id: parseInt(id),
                userId: parseInt(userId)
            },
            data: {
                title,
                notes
            }
        });

        if (updatedTopic.count === 0) {
            return res.status(404).json({ error: 'Topic not found or you do not have permission to update it' });
        }

        res.status(200).json({ message: 'Topic updated successfully' });
    } catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a topic
exports.deleteTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deletedTopic = await prisma.topic.deleteMany({
            where: {
                id: parseInt(id),
                userId: parseInt(userId)
            }
        });

        if (deletedTopic.count === 0) {
            return res.status(404).json({ error: 'Topic not found or you do not have permission to delete it' });
        }

        res.status(200).json({ message: 'Topic deleted successfully' });
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
