import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Stages allow us to "ramp up" traffic over time
  stages: [
    { duration: '1m', target: 50 },  // Below normal load
    { duration: '2m', target: 100 }, // Normal load
    { duration: '1m', target: 200 }, // Stress: Pushing to the limit
    { duration: '1m', target: 300 }, // Break: Can it handle 300?
    { duration: '2m', target: 0 },   // Scale down to see recovery
  ],
  thresholds: {
    // If more than 1% of requests fail, the test is marked as failed
    http_req_failed: ['rate<0.01'], 
    // 95% of requests should be under 500ms
    http_req_duration: ['p(95)<500'], 
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3001'; // Target your BACKEND port

  // Define a set of headers (like JSON content type)
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // 1. Stress the GET /inventory route (Reading from DB)
  let res = http.get(`${BASE_URL}/api/inventory`, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);

  // 2. Stress the POST /orders route (Writing to DB)
  // Note: Only do this if your seed data can handle many orders!
  const payload = JSON.stringify({
    dvdId: 1,
    userId: 99,
  });

  let postRes = http.post(`${BASE_URL}/api/orders`, payload, params);
  check(postRes, {
    'order created or handled': (r) => r.status === 201 || r.status === 400,
  });

  sleep(1);
}