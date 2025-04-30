import React from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const Login = () => {
    return (
        <Container maxWidth="xs">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}
            >
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>

                <TextField
                    label="Enter Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="email"
                />

                <TextField
                    label="Enter Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default Login;