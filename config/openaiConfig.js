const config = require('./config');

module.exports = function () {
    const {OpenAIApi, Configuration} = require("openai");

    const configuration = new Configuration({
        apiKey: config.openai_key,
    });
    const openai = new OpenAIApi(configuration);
    return openai;
}

