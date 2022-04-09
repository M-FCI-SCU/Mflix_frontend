import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Button, CardActions, CardContent, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import {
    useLazyQuery,
    gql
} from "@apollo/client";

const LOGIN = gql`
    query Login($email: String, $password: String) {
      login(email: $email, password: $password) {
        _id
        name
        email
        token
      }
  }
`;
export default function Login() {
    let navigate = useNavigate()
    const { setLogin } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [login, { error, data }] = useLazyQuery(LOGIN);
    const handleLogin = () => {
        setLogin(data)
        navigate("/")
    }
    useEffect(() => {
        if (data) {
            handleLogin()
        }
    }, [data])
    const AuthanticateLogin = () => {
        login({ variables: { email, password } })
    }
    // if (loading) return <p>Loading ...</p>;
    if (error) return `Error! ${error}`;
    return (
        <div style={{ paddingTop: '100px' }}>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid item lg={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ typography: 'h1', textAlign: 'center' }}>MFLIX</Box>
                        </CardContent>
                        <CardContent>
                            <TextField onChange={(e) => setEmail(e.target.value)} fullWidth size="small" id="outlined-basic" label="Email" variant="outlined" />
                            <TextField onChange={(e) => setPassword(e.target.value)} sx={{ marginTop: '10px' }} fullWidth size="small" id="outlined-basic" label="Password" type="password" variant="outlined" />
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => AuthanticateLogin()} fullWidth variant="contained">Log in</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}