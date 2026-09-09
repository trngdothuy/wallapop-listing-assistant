import request from 'supertest';
import app from '../server.js';
import examples from '../mocks/examples.json';

const isBroken = (e) =>
    !e.title ||
    !e.tags ||
    e.tags.length === 0 ||
    !e.priceRange ||
    (e.priceRange && e.priceRange.min > e.priceRange.max);

describe('POST /api/suggest', () => {
  
    beforeEach(() => {
        delete process.env.MOCK_MODE; // reset before every test so nothing leaks
    });

    // Input validation
    it('rejects an empty description with a 400', async () => {
        const res = await request(app).post('/api/suggest').send({ description: '' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    // Test that the endpoint returns a 400 for missing description field
    it('rejects a missing description field with a 400', async () => {
        const res = await request(app).post('/api/suggest').send({});
        expect(res.status).toBe(400);
    });
    
    it('rejects a whitespace-only description with a 400', async () => {
        const res = await request(app).post('/api/suggest').send({ description: '   ' });
        expect(res.status).toBe(400);
    });

    // Mock mode tests
    it('defaults to mock mode when MOCK_MODE is unset (no setup required)', async () => {
        delete process.env.MOCK_MODE;
        const res = await request(app)
        .post('/api/suggest')
        .send({ description: 'testing' });

        expect(res.status).toBe(200);
        expect(res.body.mockMode).toBe(true);
        expect(res.body.suggestion).toBeDefined();
    });

    it('stay in mock mode service when MOCK_MODE is true', async () => {
        process.env.MOCK_MODE = 'true';
        const res = await request(app)
        .post('/api/suggest')
        .send({ description: 'anything at all' });

        expect(res.status).toBe(200);
        expect(res.body.mockMode).toBe(true);
    });

    
    // Mock pool tests
    it('mock pool includes at least one deliberately broken/incomplete example', () => {
        const hasBrokenExample = examples.some(
        (e) =>
            !e.title ||
            !e.tags ||
            e.tags.length === 0 ||
            !e.priceRange ||
            (e.priceRange && e.priceRange.min > e.priceRange.max)
        );
        expect(hasBrokenExample).toBe(true);
    });

    it('mock pool is mostly well-formed (broken examples are the minority, like a real model)', () => {
        const brokenCount = examples.filter(
        (e) =>
            !e.title ||
            !e.tags ||
            e.tags.length === 0 ||
            !e.priceRange ||
            (e.priceRange && e.priceRange.min > e.priceRange.max)
        ).length;

        expect(brokenCount).toBeLessThan(examples.length / 2);
    });
    
    // Known and unknown description tests
    it('returns the exact matched suggestion (no note) for a known description', async () => {
        const res = await request(app)
            .post('/api/suggest')
            .send({ description: 'Vintage leather jacket, worn once, size M' });

        expect(res.status).toBe(200);
        expect(res.body.note).toBeFalsy();
        expect(res.body.suggestion.title).toBe(examples[0].title);
        });

    it('returns the exact matched broken example for a broken description in mock mode ', async () => {
        const res = await request(app)
            .post('/api/suggest')
            .send({ description: '!@#$%^&*()_+' });

        expect(res.status).toBe(200);
        expect(res.body.note).toBeFalsy();
        expect(res.body.suggestion.title).toBe(examples[6].title);
        });

    it('returns a random suggestion with an out-of-scope note for an unrecognized description', async () => {
        const res = await request(app)
            .post('/api/suggest')
            .send({ description: 'something totally unlisted, not in the examples' });

        expect(res.status).toBe(200);
        expect(res.body.note).toBeTruthy();
        expect(res.body.suggestion).toBeDefined();
    });
});