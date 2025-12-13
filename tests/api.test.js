const request = require('supertest');
const app = require('../src/app');

describe('Lottery API Endpoints', () => {
  beforeEach(async () => {
    // Reset the lottery before each test
    await request(app).post('/reset');
  });

  describe('GET /', () => {
    test('should return API information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status', 'running');
    });
  });

  describe('POST /participants', () => {
    test('should add a new participant', async () => {
      const response = await request(app)
        .post('/participants')
        .send({ name: 'John Doe' });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.participant).toHaveProperty('name', 'John Doe');
      expect(response.body.participant).toHaveProperty('id');
    });

    test('should add participant with email', async () => {
      const response = await request(app)
        .post('/participants')
        .send({ 
          name: 'Jane Doe',
          email: 'jane@example.com'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.participant).toHaveProperty('email', 'jane@example.com');
    });

    test('should return error when name is missing', async () => {
      const response = await request(app)
        .post('/participants')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /participants', () => {
    test('should return empty list initially', async () => {
      const response = await request(app).get('/participants');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.participants).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return all participants', async () => {
      await request(app).post('/participants').send({ name: 'Person 1' });
      await request(app).post('/participants').send({ name: 'Person 2' });
      
      const response = await request(app).get('/participants');
      
      expect(response.status).toBe(200);
      expect(response.body.participants).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });

  describe('DELETE /participants/:id', () => {
    test('should delete existing participant', async () => {
      const addResponse = await request(app)
        .post('/participants')
        .send({ name: 'Person 1' });
      
      const participantId = addResponse.body.participant.id;
      
      const deleteResponse = await request(app)
        .delete(`/participants/${participantId}`);
      
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty('success', true);
    });

    test('should return 404 for non-existent participant', async () => {
      const response = await request(app).delete('/participants/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /draw', () => {
    test('should draw one winner by default', async () => {
      await request(app).post('/participants').send({ name: 'Person 1' });
      await request(app).post('/participants').send({ name: 'Person 2' });
      
      const response = await request(app).post('/draw');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.winners).toHaveLength(1);
      expect(response.body.count).toBe(1);
    });

    test('should draw multiple winners', async () => {
      await request(app).post('/participants').send({ name: 'Person 1' });
      await request(app).post('/participants').send({ name: 'Person 2' });
      await request(app).post('/participants').send({ name: 'Person 3' });
      
      const response = await request(app)
        .post('/draw')
        .send({ count: 2 });
      
      expect(response.status).toBe(200);
      expect(response.body.winners).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });

    test('should return error when no participants', async () => {
      const response = await request(app).post('/draw');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    test('should return error when count exceeds participants', async () => {
      await request(app).post('/participants').send({ name: 'Person 1' });
      
      const response = await request(app)
        .post('/draw')
        .send({ count: 5 });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /winners', () => {
    test('should return empty list initially', async () => {
      const response = await request(app).get('/winners');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.winners).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    test('should return winners after draw', async () => {
      await request(app).post('/participants').send({ name: 'Person 1' });
      await request(app).post('/participants').send({ name: 'Person 2' });
      await request(app).post('/draw');
      
      const response = await request(app).get('/winners');
      
      expect(response.status).toBe(200);
      expect(response.body.winners).toHaveLength(1);
    });
  });

  describe('POST /reset', () => {
    test('should reset all data', async () => {
      await request(app).post('/participants').send({ name: 'Person 1' });
      await request(app).post('/participants').send({ name: 'Person 2' });
      await request(app).post('/draw');
      
      const resetResponse = await request(app).post('/reset');
      expect(resetResponse.status).toBe(200);
      expect(resetResponse.body).toHaveProperty('success', true);
      
      const participantsResponse = await request(app).get('/participants');
      expect(participantsResponse.body.participants).toEqual([]);
      
      const winnersResponse = await request(app).get('/winners');
      expect(winnersResponse.body.winners).toEqual([]);
    });
  });
});
