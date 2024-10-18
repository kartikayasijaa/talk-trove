/* eslint-disable jsx-a11y/anchor-is-valid */
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";

import {
  isLastMessage,
  isSameSender,
} from "../config/ChatLogics";


import { ChatState } from "../Context/ChatProvider"
import { Link } from "@chakra-ui/react";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", marginBottom: "10px" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="10px"
                  mr={1}
                  size="md"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginLeft: "auto" }}>
              {/* Render link previews if available */}
              {m.linkPreviews && m.linkPreviews.map((preview, index) => (
                <div key={index} style={{ marginTop: "10px", maxWidth: "60%", width: "100%", marginLeft: "10px" }}>
                  <Link href={preview.url} isExternal style={{ textDecoration: "none" }}>
                    <div style={{
                      border: "1px solid #ccc",
                      borderRadius: "15px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      padding: "10px",
                    }}>
                      {preview.image && (
                        <img src={preview.image} alt={preview.title} style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "15px",
                          objectFit: "scale-down",
                        }} />
                      )}
                      <div style={{ padding: "5px 0", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                        <strong style={{ color: "#007bff" }}>{preview.title}</strong>
                        <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>{preview.description}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              {/* Message content span now appears below the link previews */}
              <span
                style={{
                  backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                  marginTop: "5px",
                  borderRadius: "20px",
                  padding: "15px 15px",
                  maxWidth: "75%",
                  wordBreak: "break-all", // Ensure long words break
                  textDecoration: 'underline',
                }}
              >
                {m.content.split(' ').map((word) => {
                  if (word.startsWith('http://') || word.startsWith('https://')) {
                    return <a href={word} target="_blank" rel="noopener noreferrer" style={{
                      textDecoration: 'underline',
                      color: 'blue',
                      transition: 'color 0.3s ease',
                      ':active': { color: 'blue' }, 
                      ':visited': { color: 'purple' }
                    }}>{word}</a>;
                  }
                  return word + ' ';
                })}
              </span>
            </div>
            <span
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;