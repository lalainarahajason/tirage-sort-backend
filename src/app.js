const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Lottery = require('./lottery');

const app = express();
const lottery = new Lottery();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

/**
 * GET / - Health check endpoint
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'Lottery Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

/**
 * GET /participants - Get all participants
 */
app.get('/participants', (req, res) => {
  res.json({
    success: true,
    count: lottery.getParticipants().length,
    participants: lottery.getParticipants()
  });
});

/**
 * POST /participants - Add a new participant
 */
app.post('/participants', (req, res) => {
  try {
    const participant = lottery.addParticipant(req.body);
    res.status(201).json({
      success: true,
      participant
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /participants/:id - Remove a participant
 */
app.delete('/participants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const removed = lottery.removeParticipant(id);
  
  if (removed) {
    res.json({
      success: true,
      message: 'Participant removed successfully'
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Participant not found'
    });
  }
});

/**
 * POST /draw - Perform a lottery draw
 */
app.post('/draw', (req, res) => {
  try {
    const count = (req.body && req.body.count) || 1;
    const winners = lottery.draw(count);
    res.json({
      success: true,
      count: winners.length,
      winners
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /winners - Get current winners
 */
app.get('/winners', (req, res) => {
  res.json({
    success: true,
    count: lottery.getWinners().length,
    winners: lottery.getWinners()
  });
});

/**
 * POST /reset - Reset the lottery
 */
app.post('/reset', (req, res) => {
  lottery.reset();
  res.json({
    success: true,
    message: 'Lottery reset successfully'
  });
});

module.exports = app;
