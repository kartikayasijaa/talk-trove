import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ user, handleFunction, alreadyInGroup }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor={alreadyInGroup ? "not-allowed" : "pointer"}
      bg={alreadyInGroup ? "gray.400" : "gray.100"}
      _hover={alreadyInGroup ? {} : { background: "gray.200" }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      p={2}
      borderRadius="lg"
      mb={2}
    >
      <Avatar mr={2} size="sm" cursor="pointer" name={user.name} />
      <Box>
        <Text>{user.name}</Text>
        {alreadyInGroup && <Text fontSize="xs">Already in group</Text>}
      </Box>
    </Box>
  );
};


export default UserListItem;
