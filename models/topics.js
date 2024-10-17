const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query("SELECT * FROM topics;").then(({ rows }) => {
        return rows;
    });
};

exports.fetchTopicsByTopic = (topic) => {
    if (!topic) {
        return Promise.resolve();
    }
    return db
        .query("SELECT * FROM topics WHERE slug = $1;", [topic])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 400, msg: "Bad Request" });
            }
            return rows;
        });
};
