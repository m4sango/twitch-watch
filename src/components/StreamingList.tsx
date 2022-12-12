import React, {useEffect, useState} from "react";
import {CircularProgress, List, ListItem, ListItemButton, ListItemText, Typography} from "@mui/material";
import {getToken} from "../TokenManager";
import "./StreamingList.css"

type Props = {
    userId: string
}

type Streaming = {
    id: string
    user_id: string
    user_login: string
    user_name: string
    game_id: string
    game_name: string
    type: string
    title: string
    viewer_count: number
    started_at: string
    language: string
    thumbnail_url: string
    tag_ids: Array<string>
    is_mature: boolean
}

const IMAGE_WIDTH = 440
const IMAGE_HEIGHT = 248

export const StreamingList = (props: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [streams, setStreams] = useState<Array<Streaming>>([])

    useEffect(() => {
        chrome.runtime.sendMessage({
                type: "GET_FOLLOWED_STREAMS",
                token: getToken(),
                userId: props.userId
            },
            (response) => {
                setStreams(response.data);
                setLoading(false);
            })
    }, [])

    if (loading) {
        console.log("loading.")
        return (
            <CircularProgress/>
        );
    } else {
        return (
            <>
                <List disablePadding>
                    {streams.map(s => {
                        const url = `https://twitch.tv/${s.user_login}`
                        return (
                            <ListItem divider disablePadding disableGutters>
                                <ListItemButton component="a" href={url} target="_blank"
                                                rel="noopener noreferrer">
                                    <div className={"Thumbnail-box"}>
                                        <img
                                            className={"Thumbnail-img"}
                                            src={s.thumbnail_url.replace("{width}", IMAGE_WIDTH.toString()).replace("{height}", IMAGE_HEIGHT.toString())}
                                            srcSet={s.thumbnail_url.replace("{width}", IMAGE_WIDTH.toString()).replace("{height}", IMAGE_HEIGHT.toString()) + " 2x"}
                                        />
                                        <div className="Thumbnail-time">
                                            <p>{s.started_at}</p>
                                        </div>
                                    </div>
                                    <ListItemText
                                        sx={{marginTop: "0", marginBottom: "0"}}
                                        primary={s.user_name}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    variant="body2"
                                                >{s.title}
                                                </Typography>
                                                <Typography
                                                    sx={{verticalAlign: "bottom"}}
                                                    variant="body2"
                                                    color="text.primary"
                                                >{s.game_name}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    })
                    }
                </List>
            </>
        )
    }
}