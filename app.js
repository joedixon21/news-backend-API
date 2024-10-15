const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
	getArticlesById,
	getArticles,
} = require("./controllers/articles.controllers");
const app = express();
const endpoints = require("./endpoints.json");
const { customErrorHandle, ServerErrorHandle } = require("./error-handling");

app.get("/api", (request, response) => {
	response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getArticles);

app.all("*", (request, response, next) => {
	response.status(404).send({ msg: "Path Not Found" });
});

app.use(customErrorHandle);
app.use(ServerErrorHandle);

module.exports = app;
