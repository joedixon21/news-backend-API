const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => {
	return seed(data);
});

afterAll(() => {
	db.end();
});

describe("/api", () => {
	test("GET: 404 - responds with message of 'Path Not Found' when attempting to access a non-existent endpoint", () => {
		return request(app)
			.get("/api/chocolate")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Path Not Found");
			});
	});
	test("GET: 200 - responds with an object detailing all available endpoints", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body.endpoints).toEqual(endpoints);
			});
	});
});

describe("/api/topics", () => {
	test("GET: 200 - responds with an array of topic objects with properties: slug and description", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body }) => {
				expect(body.topics.length).toBe(3);
				body.topics.forEach((topic) => {
					expect(typeof topic.slug).toBe("string");
					expect(typeof topic.description).toBe("string");
				});
			});
	});
});
