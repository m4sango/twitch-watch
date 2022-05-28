import {
    API_HOST,
    CLIENT_ID,
    GET_FOLLOWED_STREAMS,
    GET_USERS,
    GET_USERS_FOLLOWS,
    LOGIN_REDIRECT_URL,
    OAUTH2_HOST
} from "./Constants";

interface Request {
    type: string,
    token: string,
    userId: string
}

chrome.runtime.onMessage.addListener((request: Request, sender, sendResponse) => {
    switch (request.type) {
        case "LOGIN":
            // TODO: state文字列を一意に生成して、戻り値を検証
            chrome.identity.launchWebAuthFlow({
                    url: `${OAUTH2_HOST}/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${LOGIN_REDIRECT_URL}&scope=user%3Aread%3Afollows&state=c3ab8aa609ea11e793ae92361f002671`,
                    interactive: true
                },
                (redirect_url) => {
                    if (redirect_url === undefined) {
                        throw new Error("not found redirect_url.");
                    }
                    const match = redirect_url.match(/access_token=(?<token>[^&]*)&/);

                    sendResponse({"accessToken": match?.groups?.token});
                });
            break;

        case "GET_USER":
            console.log("start get user.")
            fetch(`${API_HOST}${GET_USERS}`,
                {
                    headers: {
                        "Authorization": `Bearer ${request.token}`, "Client-Id": CLIENT_ID
                    }
                }
            ).then((response) => {
                return response.text();
            }).then((json) => {
                sendResponse(JSON.parse(json));
            }).catch((error) => {
                console.log(error)
                throw new Error("failed get user.");
            })
            break;

        case "GET_FOLLOWED_STREAMS":
            console.log("start get followed streams.")
            fetch(`${API_HOST}${GET_FOLLOWED_STREAMS}?user_id=${request.userId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${request.token}`, "Client-Id": CLIENT_ID
                    }
                }
            ).then((response) => {
                return response.text();
            }).then((json) => {
                sendResponse(JSON.parse(json));
            }).catch((error) => {
                console.log(error)
                throw new Error("failed get followed streams.");
            })
            break;
        case "GET_USERS_FOLLOWS":
            console.log("start get users follows.")
            fetch(`${API_HOST}${GET_USERS_FOLLOWS}?from_id=${request.userId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${request.token}`, "Client-Id": CLIENT_ID
                    }
                }
            ).then((response) => {
                return response.text();
            }).then((json) => {
                sendResponse(JSON.parse(json));
            }).catch((error) => {
                console.log(error)
                throw new Error("failed get users follows.");
            })
            break;
    }

    return true;
})