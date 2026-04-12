import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Stages allow us to "ramp up" traffic over time
  stages: [
    { duration: '1m', target: 50 },  
    { duration: '2m', target: 100 },     
    { duration: '1m', target: 200 }, 
    { duration: '1m', target: 300 },
    { duration: '2m', target: 0 },   
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], 
    http_req_duration: ['p(95)<500'], 
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3001'; 

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.get(`${BASE_URL}/api/inventory`, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
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
