import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { useState, useEffect } from 'react';
import { Button, Box, Popover, PopoverTrigger, PopoverContent, PopoverBody } from '@chakra-ui/react';
import ReactionButton from '../components/ReactionButton';
import { io } from "socket.io-client"; // Import socket.io client

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const [messageReactions, setMessageReactions] = useState({});
  const socket = io("http://localhost:5000"); // Replace with your backend URL

  useEffect(() => {
    socket.on("messageReaction", (updatedMessage) => {
      // Handle the incoming reaction update
      setMessageReactions((prev) => ({
        ...prev,
        [updatedMessage._id]: updatedMessage.reactions
      }));
    });

    return () => {
      socket.disconnect(); // Clean up on unmount
    };
  }, [socket]);

  const handleReaction = (messageId, emoji) => {
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), emoji],
    }));

    // Emit the reaction to the server
    socket.emit("reactMessage", { messageId, userId: user._id, reaction: emoji });
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }} key={m._id}>
            <div style={{ display: "flex" }}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {m.content}
              </span>
            </div>

            {/* Reaction button */}
            <Box 
              display="flex" 
              justifyContent={m.sender._id === user._id ? "flex-end" : "flex-start"} 
              marginTop="5px"
            >
              <Popover>
                <PopoverTrigger>
                  <Button 
                    size="xs" 
                    variant="outline" 
                  >
                    React
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody style={{ display: 'flex', justifyContent: 'space-around' }}>
                    {["👍", "❤️", "😂", "😢", "🎉"].map((emoji) => (
                      <ReactionButton 
                        key={emoji} 
                        emoji={emoji} 
                        onClick={() => handleReaction(m._id, emoji)} 
                      />
                    ))}
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>

            {/* Display selected reactions below the buttons */}
            {messageReactions[m._id] && messageReactions[m._id].length > 0 && (
              <span style={{ marginLeft: m.sender._id === user._id ? "50px" : "0", marginTop: '5px' }}>
                {messageReactions[m._id].map((emoji, index) => (
                  <span key={index}>{emoji}</span>
                ))}
              </span>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
