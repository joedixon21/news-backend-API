const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");

beforeEach(() => {
	return seed(data);
});

afterAll(() => {
	db.end();
});

describe("/api/topics", () => {
	test("200 - responds with an array of topic objects with properties: slug and description", () => {
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
