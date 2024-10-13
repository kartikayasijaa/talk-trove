// src/components/MessageDisplay.js
import React from 'react';
import MessageReaction from './MessageReaction';

const MessageDisplay = ({ message, userId }) => {
  return (
    <div>
      <p>{message.content}</p>
      <div>
        {message.reactions.map((reaction, index) => (
          <span key={index}>
            {reaction.reaction} from {reaction.user.name}
          </span>
        ))}
      </div>
      <MessageReaction messageId={message._id} userId={userId} />
    </div>
  );
};

export default MessageDisplay;
