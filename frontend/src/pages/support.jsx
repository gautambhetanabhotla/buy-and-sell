import Protected from "../auth.jsx";
import Navbar from "../navbar.jsx";

import { Typography, TextField, Box, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import Markdown from 'marked-react';

const Messages = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when the component mounts or messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box sx={{ height: 'calc(100vh-150px)', padding: '10px', paddingBottom: '100px' }}>
      {messages.map((message, index) => (
        <Paper key={index} variant="outlined" sx={{ padding: '10px', marginBottom: '10px' }}>
          <Typography variant="h6">{message.sender}</Typography>
          <Markdown>{message.content}</Markdown>
        </Paper>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
}

const Support = () => {

  const [message, setMessage] = useState({
    sender: "You",
    content: ""
  }); // Message to be send to the backend
  const [messages, setMessages] = useState([]);
  const [sendable, setSendable] = useState(false);
  const [responding, setResponding] = useState(false); // Set to true if awaiting a response from the chatbot
  const [defaultContext, setDefaultContext] = useState("");

  useEffect(() => {
    axios.get('/api/support/defaultcontext').then((response) => {
      setDefaultContext(response.data.context);
    }).catch((error) => {
      console.dir(error);
    });
  }, []); // Get starting context for the chat

  const sendMessage = () => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage({
      sender: "You",
      content: ""
    });
    setSendable(false);
    setResponding(true);
    axios.post('/api/support/prompt', {
      prompt: message.content,
      context: defaultContext + messages.map((m) => m.content).join('\n')
    }).then((response) => {
      setMessages((prevMessages) => [...prevMessages, {
        sender: "Gemini",
        content: response.data.output
      }]);
      setResponding(false);
    }).catch((error) => {
      console.dir(error);
      setResponding(false);
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && sendable) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Typography variant="h2" pt={8}>Support</Typography>
      <Messages messages={messages} />
      <TextField
        label="Message"
        multiline
        fullWidth
        value={message.content}
        onChange={(e) => {
          setMessage({
            sender: "You",
            content: e.target.value
          })
          setSendable(e.target.value.trim() !== '' && !responding);
        }}
        onKeyDown={handleKeyDown}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '10px',
          backgroundColor: '#111111',
        }}
      />
    </>
  );
};

const SupportPage = () => {
  return (
    <Protected>
      <Navbar />
      <Support />
    </Protected>
  );
};

export default SupportPage;
