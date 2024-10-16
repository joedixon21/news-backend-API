const { fetchArticlesById } = require("../models/articles");
const { createComment } = require("../models/comments");
const { fetchCommentsByArticleId } = require("../models/comments");

exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;

    fetchArticlesById(article_id)
        .then(() => {
            return fetchCommentsByArticleId(article_id);
        })
        .then((comments) => {
            response.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};

exports.postComment = (request, response, next) => {
    const { article_id } = request.params;
    const { username, body } = request.body;

    fetchArticlesById(article_id)
        .then(() => {
            return createComment(article_id, username, body);
        })
        .then((comment) => {
            response.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};
