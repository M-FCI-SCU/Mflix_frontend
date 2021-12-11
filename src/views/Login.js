import React from "react";
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Button, CardActions, CardContent, Box} from "@mui/material";

export default function Login() {
    return (
        <div style={{ paddingTop: '100px' }}>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid item lg={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ typography: 'h1', textAlign: 'center' }}>MFLIX</Box>
                        </CardContent>
                        <CardContent>
                            <TextField fullWidth size="small" id="outlined-basic" label="Email" variant="outlined" />
                            <TextField sx={{ marginTop: '10px' }} fullWidth size="small" id="outlined-basic" label="Password" type="password" variant="outlined" />
                        </CardContent>
                        <CardActions>
                            <Button fullWidth variant="contained">Log in</Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}