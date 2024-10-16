const { fetchUsers } = require("../models/users");

exports.getUsers = (request, response, next) => {
    fetchUsers()
        .then((users) => {
            response.status(200).send({ users });
        })
        .catch((err) => {
            next(err);
        });
};
