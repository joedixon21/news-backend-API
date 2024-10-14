const { fetchArticlesById } = require("../models/articles");

exports.getArticlesById = (request, response) => {
	const { article_id } = request.params;
	console.log(article_id, "<< controller");
	fetchArticlesById(article_id).then((article) => {
		console.log(article, "< hi");
		response.status(200).send({ article });
	});
};
