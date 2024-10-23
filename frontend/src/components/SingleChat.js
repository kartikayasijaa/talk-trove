import { BsEmojiSmile } from "react-icons/bs";
import { FormControl } from "@chakra-ui/form-control";
import { Button, Input } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import EmojiPicker from "emoji-picker-react";

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { axiosReq, ENDPOINT } from "../config/axios";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const [disappearAfter, setDisappearAfter] = useState(0);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

    const fetchMessages = async () => {
      if (!selectedChat) return;
    
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
    
        setLoading(true);
    
        const { data } = await axiosReq.get(
          `/api/message/${selectedChat._id}`,
          config // Corrected: Removed disappearAfter from here
        );
        
        setMessages(data);
        setLoading(false);
    
        socket.emit("join chat", selectedChat._id);
    
        // Set timeouts for disappearing messages
        data.forEach(msg => {
          if (msg.disappearAfter > 0) {
            setTimeout(() => {
              setMessages(prevMessages => 
                prevMessages.filter(message => message._id !== msg._id)
              );
            }, msg.disappearAfter * 1000); // Convert to milliseconds
          }
        });
    
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
    

    const sendMessage = async () => {
      if (newMessage) {
        socket.emit("stop typing", selectedChat._id);
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
    
          const { data } = await axiosReq.post(
            "/api/message",
            {
              content: newMessage,
              chatId: selectedChat._id,
              disappearAfter, // Added disappearAfter here
            },
            config
          );
    
          socket.emit("new message", data);
          setMessages(prevMessages => [...prevMessages, data]);
          setNewMessage(""); // Clear input after sending
          if (disappearAfter > 0) {
            setTimeout(() => {
              setMessages((prevMessages) => 
                prevMessages.filter((msg) => msg._id !== data._id)
              );
            }, disappearAfter * 1000); // Convert to milliseconds
          }
        } catch (error) {
          toast({
            title: "Error Occurred!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    };
    

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((emoji) => !emoji);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
                {istyping && (
                  <div
                    style={{
                      padding: "5px",
                      marginTop: "2px",
                      marginLeft: "5px",
                      borderRadius: "10px",
                      display: "inline-block",
                    }}
                  >
                    <Lottie
                      options={defaultOptions}
                      width={40}
                      height={20}
                      style={{ margin: 0 }}
                    />
                  </div>
                )}
              </div>
            )}

            <FormControl
              onKeyDown={(event) => event.key === "Enter" && sendMessage()}
              id="first-name"
              isRequired
              mt={3}
              display="flex"
              alignItems="center"
            >
              <Button onClick={toggleEmojiPicker} ml={2}>
                <BsEmojiSmile size={24} />
              </Button>
              {showEmojiPicker && (
                <div
                  style={{ position: "absolute", bottom: "60px", zIndex: 100 }}
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
              <select
        value={disappearAfter}
        onChange={(e) => setDisappearAfter(e.target.value)}
      >
        <option value="0">Do not disappear</option>
        <option value="60">1 minute</option>
        <option value="300">5 minutes</option>
        <option value="3600">1 hour</option>
      </select>
              <Button onClick={sendMessage} colorScheme="teal" ml={2}>
                Send
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
