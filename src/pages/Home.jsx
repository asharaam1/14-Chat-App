import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button, Typography } from '@mui/material';

const Home = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                textAlign="center"
            >
                <Typography variant="h3" gutterBottom>
                    Welcome to Talk Mate
                </Typography>

                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Connect, chat, and engage in seamless conversations.
                </Typography>

                <Box display="flex" gap={2} mt={3}>
                    <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
                        Login
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/signup')}>
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Home;