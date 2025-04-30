import React from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const SignUp = () => {
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
                    Sign Up
                </Typography>

                <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="text"
                />

                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="email"
                />

                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                />

                <TextField
                    label="Confirm Password"
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
                    Sign Up
                </Button>
            </Box>
        </Container>
    );
};

export default SignUp;