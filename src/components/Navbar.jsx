import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {/* Menu Icon for Mobile */}
                    <IconButton edge="start" color="inherit" aria-label="menu" sx={{ display: { xs: 'block', sm: 'none' } }} onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>

                    {/* Logo / Title */}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Talk Mate
                    </Typography>

                    {/* Buttons for Desktop */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
                        <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                        <Button color="inherit" onClick={() => navigate('/signup')}>Sign Up</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Drawer for Mobile */}
            <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
                <List>
                    {['Home', 'Login', 'Sign Up'].map((text, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => { navigate(`/${text.toLowerCase().replace(' ', '')}`); handleDrawerToggle(); }}>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
};

export default Navbar;