import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { setOwnerToken } from "../api/ownerClient";

export function OwnerHomePage() {
  const navigate = useNavigate();

  function logout() {
    setOwnerToken(null);
    navigate("/owner/login", { replace: true });
  }

  return (
    <Box maxW="lg" mx="auto" mt={20}>
      <Heading size="lg" mb={4}>
        Owner dashboard
      </Heading>
      <Text mb={6}>Signed in as owner.</Text>
      <Button onClick={logout}>Sign out</Button>
    </Box>
  );
}
