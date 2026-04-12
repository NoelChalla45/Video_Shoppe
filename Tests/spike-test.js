import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 }, // Normal load
    { duration: '1m', target: 100 },
    { duration: '10s', target: 1400 }, // SPICE: High load
    { duration: '3m', target: 1400 }, // Stay at high load
    { duration: '10s', target: 0 }, // Rapid Scale down
  ],
};

export default function () {
  http.get('http://localhost:5173');  // home page URL
  sleep(1);
}
