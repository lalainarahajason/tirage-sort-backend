/**
 * Lottery/Draw module
 * Handles participant management and draw logic
 */

class Lottery {
  constructor() {
    this.participants = [];
    this.winners = [];
  }

  /**
   * Add a participant to the lottery
   * @param {Object} participant - Participant object with name and optional data
   * @returns {Object} The added participant with assigned ID
   */
  addParticipant(participant) {
    if (!participant || !participant.name) {
      throw new Error('Participant must have a name');
    }

    const newParticipant = {
      id: this.participants.length + 1,
      name: participant.name,
      email: participant.email || null,
      ...participant
    };

    this.participants.push(newParticipant);
    return newParticipant;
  }

  /**
   * Get all participants
   * @returns {Array} Array of all participants
   */
  getParticipants() {
    return this.participants;
  }

  /**
   * Draw random winner(s) from participants
   * @param {Number} count - Number of winners to draw (default: 1)
   * @returns {Array} Array of winners
   */
  draw(count = 1) {
    if (this.participants.length === 0) {
      throw new Error('No participants available for draw');
    }

    if (count > this.participants.length) {
      throw new Error('Cannot draw more winners than available participants');
    }

    const availableParticipants = [...this.participants];
    const drawnWinners = [];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      const winner = availableParticipants.splice(randomIndex, 1)[0];
      drawnWinners.push(winner);
    }

    this.winners = drawnWinners;
    return drawnWinners;
  }

  /**
   * Get current winners
   * @returns {Array} Array of current winners
   */
  getWinners() {
    return this.winners;
  }

  /**
   * Reset the lottery (clear participants and winners)
   */
  reset() {
    this.participants = [];
    this.winners = [];
  }

  /**
   * Remove a participant by ID
   * @param {Number} id - Participant ID
   * @returns {Boolean} True if removed, false otherwise
   */
  removeParticipant(id) {
    const index = this.participants.findIndex(p => p.id === id);
    if (index !== -1) {
      this.participants.splice(index, 1);
      return true;
    }
    return false;
  }
}

module.exports = Lottery;
