import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';

const Chatbot = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [isOpen, setIsOpen] = useState(true); // Set default to true for open state

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);

      try {
        const response = await axios.post('https://murtaza011-abidipro.mdbgo.io/api/chatbot', {
          message: input,
        });
        console.log('Response from server:', response.data);
        const aiResponse = response.data.answer;
        setAnswer(aiResponse);
        setMessages([...messages, { text: input, sender: 'user' }, { text: aiResponse, sender: 'bot' }]);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        setAnswer('Sorry, something went wrong.');
        setMessages([...messages, { text: input, sender: 'user' }, { text: 'Sorry, something went wrong.', sender: 'bot' }]);
      }

      setInput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    alert('Answer copied to clipboard');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: colors.primary[400],
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: '400px',
          height: '500px',
          borderRadius: '12px',
          boxShadow: 3,
          backgroundColor: '#171615', // Set to white for better readability
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative', // Added for positioning the copy button
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Employee Chatbot
          </Typography>
          <IconButton
            onClick={handleCopy}
            color="primary"
          >
            <ContentCopyIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            mb: 2,
            backgroundColor: '#5e5c5b', // Light grey for modern look
            borderRadius: '8px',
            padding: 1,
            position: 'relative',
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                mb: 1,
                p: 1,
                backgroundColor: msg.sender === 'user' ? '#007bff' : '#28a745', // Modern blue and green
                borderRadius: '8px',
                color: '#fff',
                position: 'relative',
              }}
            >
              {msg.text}
            </Box>
          ))}
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            sx={{ mr: 1 }}
          />
          <Button variant="contained" color="primary" onClick={handleSend} endIcon={<SendIcon />}>
            ASK ME
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Chatbot;
