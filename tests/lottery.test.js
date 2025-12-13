const Lottery = require('../src/lottery');

describe('Lottery Class', () => {
  let lottery;

  beforeEach(() => {
    lottery = new Lottery();
  });

  describe('addParticipant', () => {
    test('should add a participant with name', () => {
      const participant = lottery.addParticipant({ name: 'John Doe' });
      expect(participant).toHaveProperty('id');
      expect(participant).toHaveProperty('name', 'John Doe');
      expect(lottery.getParticipants()).toHaveLength(1);
    });

    test('should add a participant with name and email', () => {
      const participant = lottery.addParticipant({ 
        name: 'Jane Doe', 
        email: 'jane@example.com' 
      });
      expect(participant).toHaveProperty('email', 'jane@example.com');
    });

    test('should throw error when participant has no name', () => {
      expect(() => lottery.addParticipant({})).toThrow('Participant must have a name');
    });

    test('should throw error when participant is null', () => {
      expect(() => lottery.addParticipant(null)).toThrow('Participant must have a name');
    });

    test('should assign sequential IDs', () => {
      const p1 = lottery.addParticipant({ name: 'Person 1' });
      const p2 = lottery.addParticipant({ name: 'Person 2' });
      const p3 = lottery.addParticipant({ name: 'Person 3' });
      
      expect(p1.id).toBe(1);
      expect(p2.id).toBe(2);
      expect(p3.id).toBe(3);
    });
  });

  describe('getParticipants', () => {
    test('should return empty array initially', () => {
      expect(lottery.getParticipants()).toEqual([]);
    });

    test('should return all participants', () => {
      lottery.addParticipant({ name: 'Person 1' });
      lottery.addParticipant({ name: 'Person 2' });
      
      const participants = lottery.getParticipants();
      expect(participants).toHaveLength(2);
    });
  });

  describe('draw', () => {
    test('should draw one winner by default', () => {
      lottery.addParticipant({ name: 'Person 1' });
      lottery.addParticipant({ name: 'Person 2' });
      
      const winners = lottery.draw();
      expect(winners).toHaveLength(1);
      expect(winners[0]).toHaveProperty('name');
    });

    test('should draw multiple winners', () => {
      lottery.addParticipant({ name: 'Person 1' });
      lottery.addParticipant({ name: 'Person 2' });
      lottery.addParticipant({ name: 'Person 3' });
      
      const winners = lottery.draw(2);
      expect(winners).toHaveLength(2);
    });

    test('should throw error when no participants', () => {
      expect(() => lottery.draw()).toThrow('No participants available for draw');
    });

    test('should throw error when count exceeds participants', () => {
      lottery.addParticipant({ name: 'Person 1' });
      
      expect(() => lottery.draw(2)).toThrow('Cannot draw more winners than available participants');
    });

    test('should draw unique winners', () => {
      lottery.addParticipant({ name: 'Person 1' });
      lottery.addParticipant({ name: 'Person 2' });
      lottery.addParticipant({ name: 'Person 3' });
      
      const winners = lottery.draw(3);
      const ids = winners.map(w => w.id);
      const uniqueIds = [...new Set(ids)];
      
      expect(uniqueIds).toHaveLength(3);
    });
  });

  describe('getWinners', () => {
    test('should return empty array initially', () => {
      expect(lottery.getWinners()).toEqual([]);
    });

    test('should return current winners after draw', () => {
      lottery.addParticipant({ name: 'Person 1' });
      lottery.addParticipant({ name: 'Person 2' });
      
      lottery.draw(1);
      const winners = lottery.getWinners();
      
      expect(winners).toHaveLength(1);
    });
  });

  describe('reset', () => {
    test('should clear all participants and winners', () => {
      lottery.addParticipant({ name: 'Person 1' });
      lottery.addParticipant({ name: 'Person 2' });
      lottery.draw(1);
      
      lottery.reset();
      
      expect(lottery.getParticipants()).toEqual([]);
      expect(lottery.getWinners()).toEqual([]);
    });
  });

  describe('removeParticipant', () => {
    test('should remove participant by ID', () => {
      const p1 = lottery.addParticipant({ name: 'Person 1' });
      lottery.addParticipant({ name: 'Person 2' });
      
      const removed = lottery.removeParticipant(p1.id);
      
      expect(removed).toBe(true);
      expect(lottery.getParticipants()).toHaveLength(1);
    });

    test('should return false when participant not found', () => {
      const removed = lottery.removeParticipant(999);
      expect(removed).toBe(false);
    });
  });
});
