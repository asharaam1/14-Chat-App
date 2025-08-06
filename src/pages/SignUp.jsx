import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firbaseconfig';
import { addDoc, collection } from 'firebase/firestore';
import CloudinaryUpload from '../hooks/uploadImage'; // ✅ Importing reusable upload component


const SignUp = () => {
    // const [name, setName] = useState('');
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profileImage: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
            const user = userCredential.user

            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: formData.name,
                email: formData.email,
                profileImage: formData.profileImage,
                createdAt: new Date()
            });

            setFormData({ name: '', email: '', password: '', profileImage: '' });

            //! Sweet Alert 
            Swal.fire({
                title: "SignUp Success",
                icon: "success",
                draggable: true
            });
            navigate('/login')

        } catch (error) {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            Swal.fire({
                icon: "error",
                title: "SignUp Failed",
                text: error.message || "An error occurred during signup"
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

                <form onSubmit={handleSignUp}>

                    <TextField
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        // type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        // type="email"
                        name="email"
                        value={formData.email}
                        // onChange={(e) => setEmail(e.target.value)}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        // type="password"
                        name="password"
                        value={formData.password}
                        // onChange={(e) => setPassword(e.target.value)}
                        onChange={handleChange}
                    />

                    <CloudinaryUpload
                        setImageUrl={(url) => {
                            console.log("Profile image URL set in form:", url);
                            setFormData({ ...formData, profileImage: url });
                        }}
                    />
                    
                    {formData.profileImage && (
                        <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                            <img 
                                src={formData.profileImage} 
                                alt="Profile Preview" 
                                style={{ 
                                    maxWidth: '150px', 
                                    maxHeight: '150px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }} 
                            />
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        type="submit"
                    // onClick={handleSignUp}
                    >
                        Sign Up
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default SignUp;