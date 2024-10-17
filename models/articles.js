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

exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
    const allowedSortByVariables = [
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "votes",
    ];
    const allowedOrderVariables = ["asc", "desc"];

    let queryStr = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comment_id) AS INT) AS comment_count
		FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
    `;

    if (
        !allowedSortByVariables.includes(sort_by) ||
        !allowedOrderVariables.includes(order)
    ) {
        return Promise.reject({ status: 400, msg: "Not a valid query" });
    }

    let queryValues = [];

    if (topic) {
        queryStr += ` WHERE articles.topic = $1`;
        queryValues.push(topic);
    }

    queryStr += ` GROUP BY articles.article_id`;

    queryStr += ` ORDER BY articles.${sort_by} ${order}`;

    return db.query(queryStr, queryValues).then(({ rows }) => {
        if (rows.length === 0 && topic) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
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
