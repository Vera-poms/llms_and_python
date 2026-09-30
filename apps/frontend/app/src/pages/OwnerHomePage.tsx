import { Box, Button, Flex, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { ownerUserApi } from "../api/ownerEndpoints";
import { setOwnerToken } from "../api/ownerClient";
import { AdminsPanel } from "../components/owner/AdminsPanel";
import { UsersPanel } from "../components/users/UsersPanel";

export function OwnerHomePage() {
  const navigate = useNavigate();

  function logout() {
    setOwnerToken(null);
    navigate("/owner/login", { replace: true });
  }

  return (
    <Box maxW="4xl" mx="auto" mt={10} px={4} pb={16}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Owner dashboard</Heading>
        <Button onClick={logout}>Sign out</Button>
      </Flex>
      <Tabs isLazy>
        <TabList>
          <Tab>Users</Tab>
          <Tab>Admins &amp; invites</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <UsersPanel api={ownerUserApi} />
          </TabPanel>
          <TabPanel px={0}>
            <AdminsPanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
