const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    return db
        .query(
            `
            SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, articles.article_id
            FROM comments JOIN articles ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            ORDER BY comments.created_at DESC;
        `,
            [article_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};
