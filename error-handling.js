exports.invalidInputErrorHandle = (err, request, response, next) => {
    if (err.code === "22P02") {
        response.status(400).send({ msg: "Bad Request" });
    } else next(err);
};

exports.foreignKeyErrorHandle = (err, request, response, next) => {
    if (err.code === "23503") {
        response.status(404).send({ msg: "User Not Found" });
    } else next(err);
};

exports.customErrorHandle = (err, request, response, next) => {
    if (err.status) {
        response.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.ServerErrorHandle = (err, request, response, next) => {
    response.status(500).send({ msg: "Server Error!" });
};
