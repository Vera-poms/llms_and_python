import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { adminUserApi } from "../api/adminEndpoints";
import { setAdminToken } from "../api/adminClient";
import { UsersPanel } from "../components/users/UsersPanel";

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
      <UsersPanel api={adminUserApi} />
    </Box>
  );
}
