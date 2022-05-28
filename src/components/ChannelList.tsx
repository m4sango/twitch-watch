import React, {useEffect, useState} from "react";
import {getToken} from "../TokenManager";

type Props = {
    userId: string
}

type Channel = {
    from_id: string
    from_login: string
    from_name: string
    to_id: string
    to_login: string
    to_name: string
    followed_at: string
}

export const ChannelList = (props: Props) => {
    const [channels, setChannels] = useState<Array<Channel>>([])

    useEffect(() => {
        chrome.runtime.sendMessage({
                type: "GET_USERS_FOLLOWS",
                token: getToken(),
                userId: props.userId
            },
            (response) => {
                setChannels(response.data)
            })
    }, [])

    return (
        <>
            {channels.map(channel => {
                return (
                    <p>{channel.to_name}</p>
                )
            })}
        </>
    )
}