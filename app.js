const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const {
    getArticlesById,
    getArticles,
    patchArticlesById,
} = require("./controllers/articles.controllers");
const {
    getCommentsByArticleId,
    postComment,
} = require("./controllers/comments.controllers");
const endpoints = require("./endpoints.json");
const {
    customErrorHandle,
    ServerErrorHandle,
    psqlErrorHandle,
} = require("./error-handling");

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(express.json());

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticlesById);

app.all("*", (request, response, next) => {
    response.status(404).send({ msg: "Path Not Found" });
});

app.use(psqlErrorHandle);
app.use(customErrorHandle);
app.use(ServerErrorHandle);

module.exports = app;
