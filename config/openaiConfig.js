import config from "./config.js";
import {Configuration, OpenAIApi} from "openai";

function openaiAPI () {

    const configuration = new Configuration({
        apiKey: config.openai_key,
    });
    return new OpenAIApi(configuration);
}

export default openaiAPI;