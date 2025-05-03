import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firbaseconfig';
import Swal from 'sweetalert2';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const userSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            setEmail('');
            setPassword('');

            Swal.fire({
                title: "Login Success",
                icon: "success",
                draggable: true
            });

            navigate('/chats');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            Swal.fire({
                title: errorCode,
                icon: "error",
                draggable: false
            });
        }
    };



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
                    onChange={(e) => { setEmail(e.target.value) }}
                />

                <TextField
                    label="Enter Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    onChange={(e) => { setPassword(e.target.value) }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={userSignIn}
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default Login;