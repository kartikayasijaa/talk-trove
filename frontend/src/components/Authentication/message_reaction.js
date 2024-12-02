import { useState } from "react";
import { Button, HStack } from "@chakra-ui/react";
import { BsEmojiHeartEyes, BsEmojiLaughing, BsHandThumbsUp } from "react-icons/bs";
import { useToast } from "@chakra-ui/react";
import { axiosReq } from "../../config/axios"; // Axios instance for API calls
import { ChatState } from "../../Context/ChatProvider";
import io from "socket.io-client";

const Message = ({ message }) => {
  const [reactions, setReactions] = useState(message.reactions || []);
  const { user } = ChatState();
  const toast = useToast();
  const socket = io("http://localhost:5000");

  const reactToMessage = async (reaction) => {
    try {
      const { data } = await axiosReq.post("/api/message/reaction", {
        messageId: message._id,
        reaction,
      });
      setReactions(data.reactions);

      // Emit the reaction to Socket.io
      socket.emit("reactMessage", { messageId: message._id, userId: user._id, reaction });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Unable to react to message.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <div>
      <p>{message.content}</p>
      <HStack>
        {reactions.map((reaction, index) => (
          <span key={index}>
            {reaction.reaction} by {reaction.user.name}
          </span>
        ))}
      </HStack>

      {/* Reaction buttons */}
      <HStack spacing={4}>
        <Button onClick={() => reactToMessage("like")}>
          <BsHandThumbsUp />
        </Button>
        <Button onClick={() => reactToMessage("love")}>
          <BsEmojiHeartEyes />
        </Button>
        <Button onClick={() => reactToMessage("laugh")}>
          <BsEmojiLaughing />
        </Button>
      </HStack>
    </div>
  );
};

export default Message;
