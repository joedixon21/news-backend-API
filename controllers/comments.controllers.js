const { fetchArticlesById } = require("../models/articles");
const { createComment, removeComment } = require("../models/comments");
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

exports.deleteComment = (request, response, next) => {
    const { comment_id } = request.params;

    removeComment(comment_id)
        .then(() => {
            response.status(204).end();
        })
        .catch((err) => {
            next(err);
        });
};
