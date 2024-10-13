import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useEffect, useState } from "react"; // Added useState
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { axiosReq } from "../config/axios";
import { socket } from "../path/to/socket"; // Import your socket instance

// Function to get the name of the other user in one-on-one chat
const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

// Simple loading component
const ChatLoading = () => (
  <div>Loading...</div>
);

const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats, setUser } = ChatState();
  const toast = useToast();
  
  // Added reactions state
  const [reactions, setReactions] = useState({});

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axiosReq.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    
    // Listen for incoming reactions
    socket.on('messageReaction', ({ messageId, reaction }) => {
      setReactions((prev) => ({
        ...prev,
        [messageId]: reaction,
      }));
    });

    // Cleanup the socket listener on component unmount
    return () => {
      socket.off('messageReaction');
    };
  }, [fetchAgain]);

  // Handle reaction submission
  const handleReaction = (messageId, reaction) => {
    socket.emit('reactMessage', { messageId, reaction });
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }} // Hide MyChats when chat is selected on mobile
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display={'flex'}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)} // Set selected chat on click
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                    {/* Added reaction display */}
                    {reactions[chat.latestMessage._id] && <span>{reactions[chat.latestMessage._id]}</span>}
                    <button onClick={() => handleReaction(chat.latestMessage._id, '👍')}>👍</button>
                    <button onClick={() => handleReaction(chat.latestMessage._id, '❤️')}>❤️</button>
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
