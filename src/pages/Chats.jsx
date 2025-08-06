import React, { useState, useEffect } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Paper,
  Divider,
  Container,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { db, auth } from '../firbaseconfig'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import Navbar from '../components/Navbar'

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [openNewChat, setOpenNewChat] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setCurrentUser({
              id: user.uid,
              name: userData.name,
              email: userData.email,
              profileImage: userData.profileImage
            })
          }
        } catch (error) {
          console.error('Error getting user data:', error)
          navigate('/login')
        }
      } else {
        navigate('/login')
      }
    })

    return () => unsubscribe()
  }, [navigate])

  // Fetch all users
  useEffect(() => {
    if (!currentUser) return

    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users')
        const q = query(usersRef)
        const querySnapshot = await getDocs(q)
        const usersData = []
        querySnapshot.forEach((doc) => {
          if (doc.id !== currentUser.id) { // Don't show current user in the list
            usersData.push({ id: doc.id, ...doc.data() })
          }
        })
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [currentUser])

  // Fetch chats
  useEffect(() => {
    if (!currentUser) return

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.id)
    )
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsData = []
      querySnapshot.forEach((doc) => {
        chatsData.push({ id: doc.id, ...doc.data() })
      })
      setChats(chatsData)
    })

    return () => unsubscribe()
  }, [currentUser])

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat) return

    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', selectedChat)
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = []
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() })
      })
      messagesData.sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return a.timestamp.toDate() - b.timestamp.toDate()
        }
        return 0
      })
      setMessages(messagesData)
    })

    return () => unsubscribe()
  }, [selectedChat])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !selectedChat || !currentUser) return

    try {
      const messageData = {
        chatId: selectedChat,
        text: message,
        senderId: currentUser.id,
        senderName: currentUser.name,
        timestamp: serverTimestamp()
      }

      // Add message to messages collection
      await addDoc(collection(db, 'messages'), messageData)

      // Update last message in chat
      const chatRef = doc(db, 'chats', selectedChat)
      await updateDoc(chatRef, {
        lastMessage: message,
        lastMessageTime: serverTimestamp()
      })

      setMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const startNewChat = async (userId) => {
    if (!currentUser) return

    try {
      // Check if chat already exists
      const chatQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', currentUser.id)
      )
      const chatSnapshot = await getDocs(chatQuery)

      let existingChat = null
      chatSnapshot.forEach((doc) => {
        const chatData = doc.data()
        if (chatData.participants.includes(userId)) {
          existingChat = { id: doc.id, ...chatData }
        }
      })

      if (existingChat) {
        setSelectedChat(existingChat.id)
      } else {
        // Create new chat
        const newChatRef = await addDoc(collection(db, 'chats'), {
          participants: [currentUser.id, userId],
          createdAt: serverTimestamp(),
          lastMessage: '',
          lastMessageTime: null
        })
        setSelectedChat(newChatRef.id)
        setMessages([])
      }
      setOpenNewChat(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error starting new chat:', error)
    }
  }

  if (!currentUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Navbar />

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        <Paper sx={{
          width: { xs: '100%', md: 320 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          borderRight: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'primary.main',
            color: 'white'
          }}>
            <Typography variant="h6">Chats</Typography>
            <IconButton onClick={() => setOpenNewChat(true)} sx={{ color: 'white' }}>
              <PersonAddIcon />
            </IconButton>
          </Box>
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {users.map((user) => {
              const existingChat = chats.find(chat =>
                chat.participants.includes(user.id)
              );
              return (
                <ListItem key={user.id} disablePadding>
                  <ListItemButton
                    onClick={() => startNewChat(user.id)}
                    selected={selectedChat === existingChat?.id}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={user.profileImage}
                        sx={{ bgcolor: 'primary.main' }}
                      >
                        {user.name?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'block' }}
                          >
                            {existingChat?.lastMessage || 'Start a conversation'}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {existingChat?.lastMessageTime?.toDate().toLocaleTimeString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Paper>

        {/* Chat Area */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}>
          {selectedChat ? (
            <>
              <Box sx={{
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: 'primary.main',
                color: 'white'
              }}>
                <Typography variant="h6">
                  {users.find(u => u.id === chats.find(c => c.id === selectedChat)?.participants.find(p => p !== currentUser.id))?.name || 'Unknown User'}
                </Typography>
              </Box>
              <Box sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
                backgroundColor: '#f5f5f5'
              }}>
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        justifyContent: msg.senderId === currentUser.id ? 'flex-end' : 'flex-start',
                        mb: 2,
                        gap: 1
                      }}
                    >
                      {msg.senderId !== currentUser.id && (
                        <Avatar
                          src={users.find(u => u.id === msg.senderId)?.profileImage}
                          sx={{ width: 32, height: 32 }}
                        >
                          {msg.senderName?.charAt(0)}
                        </Avatar>
                      )}
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          backgroundColor: msg.senderId === currentUser.id ? 'primary.main' : 'white',
                          color: msg.senderId === currentUser.id ? 'white' : 'text.primary',
                          boxShadow: 1
                        }}
                      >
                        <Typography variant="body1">{msg.text}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                          {msg.senderName} • {msg.timestamp?.toDate().toLocaleTimeString()}
                        </Typography>
                      </Paper>
                      {msg.senderId === currentUser.id && (
                        <Avatar
                          src={currentUser?.profileImage}
                          sx={{ width: 32, height: 32 }}
                        >
                          {currentUser?.name?.charAt(0)}
                        </Avatar>
                      )}
                    </Box>
                  ))
                ) : (
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <Typography variant="body1" color="text.secondary">
                      No messages yet. Start the conversation!
                    </Typography>
                  </Box>
                )}
              </Box>
              <Divider />
              <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                  p: 2,
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  backgroundColor: 'white'
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ backgroundColor: 'background.paper' }}
                />
                <IconButton
                  color="primary"
                  type="submit"
                  disabled={!message.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Select a chat to start messaging
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* New Chat Dialog */}
      <Dialog open={openNewChat} onClose={() => setOpenNewChat(false)}>
        <DialogTitle>Start New Chat</DialogTitle>
        <DialogContent>
          <List>
            {users.map((user) => (
              <ListItem key={user.id} disablePadding>
                <ListItemButton
                  onClick={() => startNewChat(user.id)}
                  selected={selectedUser === user.id}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={user.profileImage}
                      sx={{ bgcolor: 'primary.main' }}
                    >
                      {user.name?.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewChat(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Chats