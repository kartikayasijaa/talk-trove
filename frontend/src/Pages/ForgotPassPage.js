import { Container, Box, Text } from "@chakra-ui/react";
import ForgotPassword from "../components/Authentication/ForgotPassword";

function ForgotPasswordPage() {
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
          Forgot Password
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <ForgotPassword />
      </Box>
    </Container>
  );
}

export default ForgotPasswordPage;