import * as React from "react";
import {useState} from "react";
import logo from "./logo.svg";
import "./App.css";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Button, CircularProgress, Tabs} from "@mui/material";
import Tab from '@mui/material/Tab';
import {getToken, isLogin, logout, setToken} from "./TokenManager";
import {Login} from "./components/Login";
import {StreamingList} from "./components/StreamingList";
import {ChannelList} from "./components/ChannelList";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export const App = () => {
    const [value, setValue] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string>("");

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const onLogin = () => {
        chrome.runtime.sendMessage(
            {
                type: "LOGIN"
            },
            (response) => {
                setToken(response.accessToken);
            }
        )
    }

    const onLogout = () => {
        logout()
    }

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    function TabPanel(props: TabPanelProps) {
        const {children, value, index, ...other} = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    if (!isLogin()) {
        return (
            <Login onLogin={() => onLogin()}/>
        )
    } else {
        chrome.runtime.sendMessage(
            {
                type: "GET_USER",
                token: getToken()
            },
            (response) => {
                console.log(`response: ${JSON.stringify(response)}`);
                setUserId(response.data[0].id);
                setLoading(false);
            }
        )

        if (loading) {
            console.log("loading.")
            return (
                <CircularProgress/>
            );
        } else {
            console.log("start view.")
            return (
                <div className="App">
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
                            <Tab label="Item One" {...a11yProps(0)} />
                            <Tab label="Follow" {...a11yProps(1)} />
                            <Tab label="Streaming" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <header className="App-header">
                            <img src={logo} className="App-logo" alt="logo"/>
                            <p>
                                Edit <code>src/App.tsx</code> and save to reload.
                                token: {getToken()}
                            </p>
                            <a
                                className="App-link"
                                href="https://reactjs.org"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Learn React
                            </a>
                        </header>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Button onClick={() => onLogout()}>Logout</Button>
                        <ChannelList userId={userId}/>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <StreamingList userId={userId}/>
                    </TabPanel>
                </div>
            );
        }
    }
};
