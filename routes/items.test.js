process.env.NODE_ENV = 'test'; // test mode
const request = require('supertest');

const app = require('../app');
let items = require('../fakeDb');

let bounty = { name: 'Bounty', price: 1.5 };

beforeEach(() => {
	items.push(bounty); // push new test item to empty array
});

afterEach(() => {
	items.length = 0; //empty an array
});

describe('GET /items', () => {
	test('Get all items', async () => {
		const res = await request(app).get('/items'); //getting items route from app
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ items: [bounty] });
	});
});

describe('POST /items', () => {
	test('creating an item', async () => {
		// mimic sending a request with new item
		const res = await request(app).post('/items').send({ name: 'Avocado', price: 1.0 });
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ item: { name: 'Avocado', price: 1.0 } });
	});
	test('Responds with 400 if name is missing', async () => {
		const res = await request(app).post('/items').send({});
		expect(res.statusCode).toBe(400);
	});
});

describe('GET /items/:name', () => {
	test('Get item by name', async () => {
		const res = await request(app).get(`/items/${bounty.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ item: bounty });
	});
	test('Responds with 404 for invalid item', async () => {
		const res = await request(app).get(`/items/coconut`);
		expect(res.statusCode).toBe(404);
	});
});

describe('/PATCH /items/:name', () => {
	test('Updating an item', async () => {
		const res = await request(app).patch(`/items/${bounty.name}`).send({ name: 'bountyYYY', price: 3.5 });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ item: { name: 'bountyYYY', price: 3.5 } });
	});
	test('Responds with 404 for invalid name', async () => {
		const res = await request(app).patch(`/items/invalid`).send({ name: 'bountyYYY', price: 3.5 });
		expect(res.statusCode).toBe(404);
	});
});

describe('/DELETE /items/:name', () => {
	test('Deleting an item', async () => {
		const res = await request(app).delete(`/items/${bounty.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Deleted' });
	});
	test('Responds with 404 for deleting invalid item', async () => {
		const res = await request(app).delete(`/items/invalid`);
		expect(res.statusCode).toBe(404);
	});
});
