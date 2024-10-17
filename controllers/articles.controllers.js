const {
    fetchArticlesById,
    fetchArticles,
    updateArticlesById,
} = require("../models/articles");

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
    const { sort_by, order, topic } = request.query;
    fetchArticles(sort_by, order, topic)
        .then((articles) => {
            response.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
};

exports.patchArticlesById = (request, response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;

    fetchArticlesById(article_id)
        .then(() => {
            return updateArticlesById(article_id, inc_votes);
        })
        .then((article) => {
            response.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};
