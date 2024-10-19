import { EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

const ProfileModal = ({ user, onUpdate, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast(); // For displaying notifications

  // State to manage editable fields
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState(user.pic);
  const [imagePreview, setImagePreview] = useState(user.pic);
  const [loading, setLoading] = useState(false); // For loading state

  // Update local state when user prop changes
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setImage(user.pic);
    setImagePreview(user.pic);
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!name || !email) {
        toast({
            title: "Missing Fields",
            description: "Name and Email cannot be empty",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (image && image !== user.pic) {
        formData.append("pic", image);
    }

    try {
        const token = localStorage.getItem("token");
        console.log("Token:", token); // Log the token for debugging

        if (!token) {
            console.error("No token found in local storage."); // Log for debugging
            throw new Error("Not authorized, no token found");
        }

        const response = await axios.put("/api/user/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        onUpdate(response.data); // Update user info in parent component
        toast({
            title: "Profile Updated",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        onClose();
    } catch (error) {
        console.error("Error updating profile:", error); // Log error details for debugging
        toast({
            title: "Error Updating Profile",
            description: error.response?.data?.message || error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
    } finally {
        setLoading(false);
    }
};


  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="md" boxShadow="lg">
          <ModalHeader
            fontSize="32px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            color="teal.600"
          >
            Edit Profile
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box position="relative" display="flex" justifyContent="center">
                <Image
                  borderRadius="full"
                  boxSize="120px"
                  src={imagePreview}
                  alt={name}
                  boxShadow="md"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  display="none"
                  id="file-input"
                />
                <Tooltip label="Edit Image" aria-label="Edit Image Tooltip">
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit Image"
                    colorScheme="teal"
                    borderRadius="full"
                    position="absolute"
                    bottom={0}
                    right={0}
                    m={1}
                    variant="ghost"
                    _hover={{ bg: "teal.100" }}
                    onClick={() =>
                      document.getElementById("file-input").click()
                    } // Trigger file input click
                  />
                </Tooltip>
              </Box>
              <FormControl>
                <FormLabel fontWeight="bold">Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  variant="flushed"
                />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold">Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  variant="flushed"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={handleSave}
              isLoading={loading}
            >
              Save Changes
            </Button>
            <Button variant="outline" onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
