import React from 'react';
import { Button } from '@chakra-ui/react'; // Assuming you're using Chakra UI for styling

const ReactionButton = ({ emoji, onClick }) => {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="outline"
      marginRight="5px"
    >
      {emoji}
    </Button>
  );
};

console.log(ReactionButton);
export default ReactionButton; // Ensure it's a default export
