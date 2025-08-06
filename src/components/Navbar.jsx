import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firbaseconfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        setUser({
                            id: currentUser.uid,
                            name: userDoc.data().name,
                            email: userDoc.data().email,
                            profileImage: userDoc.data().profileImage
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <>
            <AppBar 
                position="static" 
                sx={{ 
                    borderBottom: '3px solid rgba(0, 0, 0, 0.12)',
                    boxShadow: 'none'
                }}
            >
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
                    {user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                {user.name}
                            </Typography>
                            <IconButton
                                onClick={handleProfileMenuOpen}
                                size="small"
                                sx={{ ml: 2 }}
                            >
                                <Avatar 
                                    src={user.profileImage}
                                    sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                                >
                                    {user.name.charAt(0)}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleProfileMenuClose}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
                            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                            <Button color="inherit" onClick={() => navigate('/signup')}>Sign Up</Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Drawer for Mobile */}
            <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
                <List>
                    {user ? (
                        <>
                            <ListItem>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                    <Avatar 
                                        src={user.profileImage}
                                        sx={{ bgcolor: 'primary.main' }}
                                    >
                                        {user.name.charAt(0)}
                                    </Avatar>
                                    <Typography>{user.name}</Typography>
                                </Box>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleLogout}>
                                    <ListItemText primary="Logout" />
                                </ListItemButton>
                            </ListItem>
                        </>
                    ) : (
                        ['Home', 'Login', 'Sign Up'].map((text, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton onClick={() => { navigate(`/${text.toLowerCase().replace(' ', '')}`); handleDrawerToggle(); }}>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    )}
                </List>
            </Drawer>
        </>
    );
};

export default Navbar;