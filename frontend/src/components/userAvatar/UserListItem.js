import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { CheckIcon } from "@chakra-ui/icons";

const UserListItem = ({ handleFunction, user, alreadyInGroup }) => {
  return (
    <Box
      onClick={alreadyInGroup ? null : handleFunction}
      cursor={alreadyInGroup ? "not-allowed" : "pointer"}
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box flex="1">
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>

      {alreadyInGroup && (
        <CheckIcon color="green.500" /> 
      )}
    </Box>
  );
};

export default UserListItem;
