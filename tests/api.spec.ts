import { test, expect } from '@playwright/test';

test.describe('API testing with Playwright', () => {
  test('GET /posts/1 returns a valid JSON object', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({
      userId: 1,
      id: 1,
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test('POST /posts can create a resource and returns 201', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: {
        title: 'Playwright API test',
        body: 'Testing API requests with Playwright',
        userId: 123,
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject({
      title: 'Playwright API test',
      body: 'Testing API requests with Playwright',
      userId: 123,
    });
    expect(body.id).toBeTruthy();
  });

  test('GET /comments with query params returns filtered results', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/comments', {
      params: { postId: '1' },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const comments = await response.json();
    expect(Array.isArray(comments)).toBeTruthy();
    expect(comments.length).toBeGreaterThan(0);
    expect(comments[0]).toHaveProperty('postId', 1);
  });
});
