// TODO: localStorage保存はセキュリティ的によく無いので
export const setToken = (token: string) => {
    localStorage.setItem("twitch_oauth2", token);
}

export const getToken = (): string => {
    const token = localStorage.getItem("twitch_oauth2");
    if (token === null) {
        throw new Error("not login.")
    }
    return token;
}

export const isLogin = (): boolean => {
    const token = localStorage.getItem("twitch_oauth2");
    console.log(`token: ${token}`)
    return !(token === undefined || token === null || token === "undefined");
}

export const logout = () => {
    localStorage.removeItem("twitch_oauth2");
}