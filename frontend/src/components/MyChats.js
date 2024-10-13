import React, { useState, useEffect } from 'react';
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { axiosReq } from "../config/axios";

// Function to get the name of the other user in one-on-one chat
const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

// Simple loading component
const ChatLoading = () => <div>Loading...</div>;

const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats, setUser } = ChatState();
  const [mutedChats, setMutedChats] = useState({});
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axiosReq.get("/api/chat", config);
      setChats(data);

      // Initialize mute status for all chats
      const muteStatus = {};
      data.forEach((chat) => {
        muteStatus[chat._id] = chat.isMuted; // Assuming the 'isMuted' status is fetched with chat data
      });
      setMutedChats(muteStatus);
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

  const toggleMute = async (chatId, isMuted) => {
    try {
      const endpoint = isMuted ? `/api/chat/unmute/${chatId}` : `/api/chat/mute/${chatId}`;
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axiosReq.put(endpoint, {}, config);

      // Update the mute status locally after the API call
      setMutedChats((prev) => ({ ...prev, [chatId]: !isMuted }));
    } catch (error) {
      console.error('Failed to toggle mute', error);
      toast({
        title: "Error Occurred!",
        description: "Failed to update mute status",
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
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
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
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Text>
                    {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
                <Button
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering chat selection
                    toggleMute(chat._id, mutedChats[chat._id]);
                  }}
                >
                  {mutedChats[chat._id] ? 'Unmute' : 'Mute'}
                </Button>
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
