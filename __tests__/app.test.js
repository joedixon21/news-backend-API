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
  test("GET: 200 - responds with an article by its id with a comment_count property of correct value", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("comment_count");
        expect(body.article.comment_count).toBe(2);
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
  test("PATCH: 200 - responds with article object with additional votes sent in request body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 20,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("votes", 120);
      });
  });
  test("PATCH: 200 - responds with article object with negative votes added", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -20,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("votes", 80);
      });
  });
  test("PATCH: 400 - responds with 'Bad Request' when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: "pizza",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH: 400 - responds with 'Bad Request' when inc_votes is not provided in request body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        not_inc_votes: 20,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH: 404 - responds with 'Not Found' when inc_votes is added to a valid but non-existent article", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({
        inc_votes: "20",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("PATCH: 400 - responds with 'Bad Request' when inc_votes is added to an invalid article_id", () => {
    return request(app)
      .patch("/api/articles/not-a-valid-id")
      .send({
        inc_votes: "20",
      })
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
  test("GET: 200 - responds with an array of article objects sorted by date by default in descending order", () => {
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
  test("GET: 200 - takes a sort_by query and responds with articles sorted by the given column name", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("GET: 200 - takes a sort_by query and responds with articles sorted by comment_count", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("comment_count", {
          descending: true,
        });
      });
  });
  test("GET: 400 - responds with 'Bad Request' when request to sort by invalid query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_img_url")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET: 200 - responds with articles in order based on order query (defaults to descending)", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", {
          descending: false,
        });
      });
  });
  test("GET: 200 - responds with articles sorted by title when requested as query", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("GET: 200 - responds with articles sorted by topic when requested as query", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("topic", {
          descending: true,
        });
      });
  });
  test("GET: 200 - responds with articles sorted by author when requested as query", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", {
          descending: true,
        });
      });
  });
  test("GET: 200 - responds with articles sorted by created_at when requested as query", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: 200 - responds with articles sorted by votes when requested as query", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("GET: 400 - responds with 'Bad Request' when request to order is invalid (i.e. not asc or desc)", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=alphabetically")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET: 200 - takes a topic query and responds with the articles by the topic value specified", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(1);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("GET: 200 - topic query is optional and when not provided will default to receiving all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
      });
  });
  test("GET: 400 - responds with 'Bad Request' when a topic that doesn't exist and is invalid is requested", () => {
    return request(app)
      .get("/api/articles?topic=not-a-valid-topic")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET: 404 - responds with 'Not Found' when a valid topic that has no associated articles is requested", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
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
  test("GET: 404 - responds with 'Not Found' when attempting to access an array of comments with a valid article_id that doesn't exist in the database", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("GET: 200 - responds with an empty array when passed an article_id that exists in the database but has no comments associated", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments).toHaveLength(0);
      });
  });
  test("GET: 400 - responds with 'Bad Request' when attempting to access an article with an invalid id", () => {
    return request(app)
      .get("/api/articles/not-a-valid-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST: 201 - responds with posted comment from existing user", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "This is an interesting article!",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty(
          "body",
          "This is an interesting article!"
        );
        expect(body.comment).toHaveProperty("author", "butter_bridge");
      });
  });
  test("POST: 201 - responds with posted comment from existing user when unnecessary properties are provided", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "This is an interesting article!",
        likesCats: true,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toHaveProperty(
          "body",
          "This is an interesting article!"
        );
        expect(body.comment).toHaveProperty("author", "butter_bridge");
      });
  });
  test("POST: 404 - responds with 'Not Found' when a user that doesn't exists attempts to post a comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "joed88",
        body: "This is an interesting article!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found");
      });
  });
  test("POST: 400 - responds with 'Bad Request' when body does not contain correct fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "joed88",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST: 400 - responds with 'Bad Request' when body contains correct fields but contents is invalid", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: [3, 4, 5],
        body: { comment: "Hi!" },
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST: 404 - responds with 'Not Found' when attempting to post a comment to an article with a valid id that doesn't exist", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({
        username: "butter_bridge",
        body: "This is an interesting article!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("POST: 400 - responds with 'Bad Request' when attempting to post a comment to an article with an invalid id", () => {
    return request(app)
      .post("/api/articles/not-a-valid-id/comments")
      .send({
        username: "butter_bridge",
        body: "This is an interesting article!",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE: 204 - status when a given comment is deleted", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE: 404 - responds with 'Not Found' when attempting to delete a non-existent comment with a valid id", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("DELETE: 400 - responds with 'Bad Request' when attempting to delete a comment with an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-valid-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/users", () => {
  test("GET: 200 - responds with an array of user objects with properties: username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
