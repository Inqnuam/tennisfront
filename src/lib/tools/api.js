import { get } from "svelte/store";
import { api_key } from "../stores.js";

/**
 * @function
 * @param `method` {string} GET | POST | PUSH | DELETE
 * @param `link` {string} endpoint link
 * @param `body` {object|FormData} request body
 */
export const api = (method, link, body) => {
    return new Promise(async (resolve, reject) => {
        var options = {
            method: method,
            headers: {
                Accept: "*/*",
                "api-key": get(api_key),
            },
        };

        if (body instanceof FormData) {
            options.body = body;
        } else if (body instanceof Object) {
            options.body = JSON.stringify(body);
            options.headers["Content-Type"] = "application/json";
        }

        const response = await fetch(`${process.env.API_LINK}${link}`, options).catch((err) => {
            resolve(err);
        });
        if (response)
            if (response.ok) {
                const json = await response.json();

                if (!process.env.isProd) {
                    console.log(`%c${method} %c${link}`, "color:#32a852;", "color:#c97900;", json);
                }

                resolve(json);
            } else {
                const json = await response.json();
                if (!process.env.isProd) {
                    console.warn(method, link, body, json);
                }
                reject(json);
            }
    });
};
