import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3,
  duration: '5s',
  thresholds: {
    http_req_duration: ['p(95) < 500'],
    http_req_failed: ['rate < 0.01'],
  },
};

const BASE_URL = 'https://kidane-s.github.io/Playwright-demo/';

export default function () {
  const homeRes = http.get(BASE_URL);
  check(homeRes, {
    'home status is 200': (r) => r.status === 200,
    'home title contains Playwright': (r) => r.body.includes('Playwright Test Page'),
  });

  const aboutRes = http.get(`${BASE_URL}about.html`);
  check(aboutRes, {
    'about status is 200': (r) => r.status === 200,
  });

  const dashboardRes = http.get(`${BASE_URL}dashboard.html`);
  check(dashboardRes, {
    'dashboard status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
