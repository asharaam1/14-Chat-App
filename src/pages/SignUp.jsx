import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firbaseconfig';
import Swal from 'sweetalert2';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');



    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password, name)
            setName('');
            setEmail('');
            setPassword('');

            //! Sweet Alert 
            Swal.fire({
                title: "SignUp Success",
                icon: "success",
                draggable: true
            });
            
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            Swal.fire({
                icon: "error",
                title: errorCode,
            });
        }
    }




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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleSignUp}
                >
                    Sign Up
                </Button>
            </Box>
        </Container>
    );
};

export default SignUp;