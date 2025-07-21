import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatWindow = (props) => {
  const [messageInput, setMessageInput] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messageWindowRef = useRef(null);

  const fetchMessageList = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/messages/${props.complaintId}`);
      setMessageList(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessageList();
  }, [props.complaintId]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const sendMessage = async () => {
    try {
      const data = {
        name: props.name,
        message: messageInput,
        complaintId: props.complaintId
      };
      const response = await axios.post('http://localhost:8000/messages', data);
      setMessageList([...messageList, response.data]);
      setMessageInput('');
      fetchMessageList();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    if (messageWindowRef.current) {
      messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
    }
  };

  return (
    <div
      className="container my-5"
      style={{
        maxWidth: '600px',
        background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
        border: '1px solid #dee2e6',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
        fontFamily: 'Segoe UI, sans-serif'
      }}
    >
      <h4 className="text-center text-muted mb-4">Message Box</h4>
      
      <div
        ref={messageWindowRef}
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid #e4e6ea',
          borderRadius: '8px',
          padding: '12px',
          backgroundColor: '#fefefe',
          marginBottom: '15px'
        }}
      >
        {messageList.slice().reverse().map((msg) => (
          <div
            key={msg._id}
            style={{
              padding: '8px 10px',
              marginBottom: '10px',
              backgroundColor: '#f0f4f8',
              borderRadius: '10px',
              color: '#333'
            }}
          >
            <div className="fw-semibold mb-1">{msg.name}:</div>
            <div>{msg.message}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}, {new Date(msg.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex gap-2">
        <input
          type="text"
          required
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="form-control"
          style={{
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
        <button onClick={sendMessage} className="btn btn-outline-primary">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;