// Chat component
const [reactions, setReactions] = useState({});

// Function to send reaction
const sendReaction = (messageId, reaction) => {
  socket.emit('reactMessage', { messageId, reaction });
};

// Listen for reactions
useEffect(() => {
  socket.on('messageReaction', ({ messageId, reaction }) => {
    setReactions((prev) => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), reaction],
    }));
  });
}, [socket]);

// Rendering reactions
const renderReactions = (messageId) => {
  return reactions[messageId]?.map((reaction, index) => (
    <span key={index}>{reaction}</span>
  ));
};

// Message UI with reactions
return (
  <div>
    {messages.map((message) => (
      <div key={message.id}>
        <p>{message.text}</p>
        <div>{renderReactions(message.id)}</div>
        <button onClick={() => sendReaction(message.id, '❤️')}>❤️</button>
        <button onClick={() => sendReaction(message.id, '👍')}>👍</button>
      </div>
    ))}
  </div>
);
