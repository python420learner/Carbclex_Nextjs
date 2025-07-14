"use client"
import React, { useState, useEffect } from 'react';

const AdminMessage = ({ project }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Generate a consistent storage key
  const storageKey = `project_messages_${project.id}`;

  // Load messages from localStorage
  useEffect(() => {
    try {
      console.log(`Loading messages for key: ${storageKey}`); // Debug
      const savedMessages = localStorage.getItem(storageKey);
      console.log('Raw localStorage value:', savedMessages); // Debug
      
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        console.log('Parsed messages:', parsedMessages); // Debug
        setMessages(Array.isArray(parsedMessages) ? parsedMessages : []);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading messages:', error);
      localStorage.removeItem(storageKey); // Clear corrupt data
      setMessages([]);
    }
  }, [storageKey]);

  // Save messages to localStorage
  useEffect(() => {
    if (isLoaded) { // Only save after initial load
      console.log('Saving messages:', messages); // Debug
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey, isLoaded]);

  const handleAddMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleDeleteMessage = (id) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };

  // Debug function to check all localStorage entries
  const debugLocalStorage = () => {
    console.log('All localStorage entries:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(key, localStorage.getItem(key));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Your existing project details... */}
      
      {/* Messages Section */}
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Project Notes</h2>
          <button 
            onClick={debugLocalStorage}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Debug Storage
          </button>
        </div>
        
        {/* Message Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddMessage()}
            placeholder="Add a note about this project..."
            className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        
        {/* Messages List */}
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-start">
              <div>
                <p className="text-gray-800">{message.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteMessage(message.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
          
          {messages.length === 0 && (
            <p className="text-gray-500 text-center py-4">No notes yet. Add your first note above.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessage;