const { fetchArticlesById, fetchArticles } = require("../models/articles");

exports.getArticlesById = (request, response, next) => {
	const { article_id } = request.params;
	fetchArticlesById(article_id)
		.then((article) => {
			response.status(200).send({ article });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getArticles = (request, response, next) => {
	fetchArticles().then((articles) => {
		response.status(200).send({ articles });
	});
};
