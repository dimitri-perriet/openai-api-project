import config from "./config.js";
import {OpenAIApi, Configuration} from "openai";

function openaiAPI () {

    const configuration = new Configuration({
        apiKey: config.openai_key,
    });
    const openai = new OpenAIApi(configuration);
    return openai;
}

export default openaiAPI;