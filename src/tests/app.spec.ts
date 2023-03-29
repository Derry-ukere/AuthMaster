import request from 'supertest';

import app from '../app';

jest.mock('async-redis', () => ({
  createClient: jest.fn().mockReturnValue({
    on: jest.fn(),
    hget: jest.fn().mockResolvedValue(''),
  }),
}));

jest.mock('mongoose', () => ({
  Schema: jest.fn().mockReturnValue({
    index: jest.fn(),
    set: jest.fn(),
  }),
  createConnection: jest.fn().mockReturnValue({
    useDb: jest.fn().mockReturnValue({
      model: jest.fn(),
    }),
    on: jest.fn(),
  }),
}));

jest.mock('request-debug', () => jest.fn());

describe('Testing endpoints', function() {
  it('GET / - Should return 404', done => {
    request(app)
      .get('/')
      .expect(404, done);
  });

  it('GET /health - Should return 200 Ok', done => {
    request(app)
      .get('/health')
      .expect(200, done);
  });
});
