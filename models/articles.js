const db = require("../db/connection");

exports.fetchArticlesById = (article_id) => {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }
    return db
        .query(
            `
            SELECT * FROM articles
            WHERE article_id = $1;
        `,
            [article_id]
        )
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not Found" });
            }
            return rows[0];
        });
};

exports.fetchArticles = (sort_by = "created_at") => {
    const allowedVariables = [
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "votes",
    ];
    let queryStr = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comment_id) AS INT) AS comment_count
		FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
    `;
    if (!allowedVariables.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Not a valid query" });
    }

    queryStr += ` ORDER BY articles.${sort_by} DESC`;

    return db.query(queryStr).then(({ rows }) => {
        return rows;
    });
};

exports.updateArticlesById = (article_id, inc_votes) => {
    if (!inc_votes) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    return db
        .query(
            `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
    `,
            [inc_votes, article_id]
        )
        .then(({ rows }) => {
            return rows[0];
        });
};
