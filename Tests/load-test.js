import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,           // number of virtual users
  duration: '30s',   // how long to run the test
};

export default function () {
  http.get('http://localhost:5173');  // home page URL
  sleep(1);                           // wait 1s before next request
}