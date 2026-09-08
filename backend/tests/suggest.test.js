process.env.MOCK_MODE = 'true';

const request = require('supertest');
const app = require('../server');

describe('POST /api/suggest', () => {
  it('rejects an empty description with a 400', async () => {
    const res = await request(app).post('/api/suggest').send({ description: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('rejects a missing description field with a 400', async () => {
    const res = await request(app).post('/api/suggest').send({});
    expect(res.status).toBe(400);
  });

  it('returns a suggestion shape in mock mode, flagged as mockMode: true', async () => {
    const res = await request(app)
      .post('/api/suggest')
      .send({ description: 'Vintage leather jacket, worn once, size M' });

    expect(res.status).toBe(200);
    expect(res.body.mockMode).toBe(true);
    expect(res.body.suggestion).toBeDefined();
  });

  it('mock pool includes at least one deliberately broken/incomplete example', () => {
    const examples = require('../mocks/examples.json');
    const hasBroken = examples.some(
      (e) =>
        !e.title ||
        !e.tags ||
        e.tags.length === 0 ||
        !e.priceRange ||
        (e.priceRange && e.priceRange.min > e.priceRange.max)
    );
    expect(hasBroken).toBe(true);
  });
});