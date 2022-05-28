import {Button} from "@mui/material";
import React, {MouseEventHandler} from "react";

type Props = {
    onLogin: MouseEventHandler
}
export const Login = (props: Props) => {
    return (
        <Button variant="contained" onClick={props.onLogin}>Twitchにログイン</Button>
    );
}