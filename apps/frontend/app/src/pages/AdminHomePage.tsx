import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { setAdminToken } from "../api/adminClient";

export function AdminHomePage() {
  const navigate = useNavigate();

  function logout() {
    setAdminToken(null);
    navigate("/admin/login", { replace: true });
  }

  return (
    <Box maxW="4xl" mx="auto" mt={10} px={4} pb={16}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Admin dashboard</Heading>
        <Button onClick={logout}>Sign out</Button>
      </Flex>
      <Text color="gray.500">You are signed in as an admin.</Text>
    </Box>
  );
}
