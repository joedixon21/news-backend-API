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

describe("/api/articles/:article_id", () => {
    test("GET: 200 - responds with an article by its id", () => {
        return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toHaveProperty(
                    "title",
                    "Eight pug gifs that remind me of mitch"
                );
                expect(typeof body.article.created_at).toBe("string");
                expect(body.article).toHaveProperty("topic", "mitch");
                expect(body.article).toHaveProperty("author", "icellusedkars");
            });
    });
    test("GET: 404 - responds with 'Not Found' when attempting to access an article with a valid id that doesn't exist", () => {
        return request(app)
            .get("/api/articles/9999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
            });
    });
    test("GET: 400 - responds with 'Bad Request' when attempting to access an article with an invalid id", () => {
        return request(app)
            .get("/api/articles/not-a-valid-id")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
    });
});

describe("/api/articles", () => {
    test("GET: 200 - responds with an array of article objects with properties: author, title, article_id, topic, created_at, votes article_img_url and comment_count", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(13);
                body.articles.forEach((article) => {
                    expect(typeof article.author).toBe("string");
                    expect(typeof article.title).toBe("string");
                    expect(typeof article.article_id).toBe("number");
                    expect(typeof article.topic).toBe("string");
                    expect(typeof article.created_at).toBe("string");
                    expect(typeof article.votes).toBe("number");
                    expect(typeof article.article_img_url).toBe("string");
                    expect(typeof article.comment_count).toBe("number");
                });
            });
    });
    test("GET: 200 - responds with an array of article objects sorted by date in descending order", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("created_at", {
                    descending: true,
                });
            });
    });
    test("GET: 200 - articles objects do not have a body property", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                body.articles.forEach((article) => {
                    expect(article).not.toHaveProperty("body");
                });
            });
    });
});

describe("/api/articles/:article_id/comments", () => {
    test("GET: 200 - responds with an array of comments for the given article_id of which each comment has the following properties: comment-id, votes, created_at, author, body and article_id", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                body.comments.forEach((comment) => {
                    expect(comment.article_id).toBe(1);
                    expect(typeof comment.comment_id).toBe("number");
                    expect(typeof comment.votes).toBe("number");
                    expect(typeof comment.created_at).toBe("string");
                    expect(typeof comment.author).toBe("string");
                    expect(typeof comment.body).toBe("string");
                    expect(typeof comment.article_id).toBe("number");
                });
            });
    });
    test("GET: 200 - responds with an array of comments with the most recent ones first", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toBeSortedBy("created_at", {
                    descending: true,
                });
            });
    });
});
