import { Container, Box, Text } from "@chakra-ui/react";
import ResetPassword from "../components/Authentication/ResetPassword";

function ResetPasswordPage() {
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Reset Password
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <ResetPassword />
      </Box>
    </Container>
  );
}

export default ResetPasswordPage;
