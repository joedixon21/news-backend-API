const { fetchTopics } = require("../models/topics");

exports.getTopics = (request, response) => {
	fetchTopics().then((topics) => {
		response.status(200).send({ topics });
	});
};
