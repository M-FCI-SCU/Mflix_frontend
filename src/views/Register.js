import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Button, CardActions, CardContent, Box } from "@mui/material";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const CREATE_USER = gql`
    mutation registerQuery($name: String,$email: String,$password: String){
        register(name: $name, email:$email, password: $password){
            type
            message
            data 
        }
     }
`

export default function Register() {
    const navigate = useNavigate()
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [createUser, { data, loading, error }] = useMutation(CREATE_USER)

    useEffect(() => {
        if (data) {
            toasterHandler(data.register.type, data.register.message)
            if (data.register.type == 'success') {
                navigate("/login")
            }
        }
    }, [data])

    const toasterHandler = (type, message) => {
        if (type == 'success') {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    return (
        <div style={{ paddingTop: '100px' }}>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid item lg={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ typography: 'h1', textAlign: 'center' }}>MFLIX</Box>
                        </CardContent>
                        <CardContent>
                            <TextField onChange={(e) => setName(e.target.value)} fullWidth size="small" id="name" label="name" variant="outlined" />
                            <TextField onChange={(e) => setEmail(e.target.value)} sx={{ my: '12px' }} fullWidth size="small" id="email" label="Email" variant="outlined" />
                            <TextField onChange={(e) => setPassword(e.target.value)} fullWidth size="small" id="password" label="Password" type="password" variant="outlined" />
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => createUser({
                                variables: {
                                    name,
                                    email,
                                    password
                                }
                            })} fullWidth variant="contained">Create</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}