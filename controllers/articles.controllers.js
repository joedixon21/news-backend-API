const {
    fetchArticlesById,
    fetchArticles,
    updateArticlesById,
} = require("../models/articles");
const { fetchTopics, fetchTopicsByTopic } = require("../models/topics");

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

    fetchTopicsByTopic(topic)
        .then(() => {
            return fetchArticles(sort_by, order, topic);
        })
        .then((articles) => {
            if (articles.length === 0) {
                return Promise.reject({ status: 404, msg: "Not Found" });
            }
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
