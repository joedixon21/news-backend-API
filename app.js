const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticlesById } = require("./controllers/articles.controllers");
const app = express();
const endpoints = require("./endpoints.json");

app.get("/api", (request, response) => {
	response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.all("*", (request, response, next) => {
	response.status(404).send({ msg: "Path Not Found" });
});

module.exports = app;
