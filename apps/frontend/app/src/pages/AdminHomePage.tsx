import { Box, Button, Flex, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { adminResourceApi, adminUserApi } from "../api/adminEndpoints";
import { setAdminToken } from "../api/adminClient";
import { ResourcesPanel } from "../components/resources/ResourcesPanel";
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
      <Tabs isLazy>
        <TabList>
          <Tab>Users</Tab>
          <Tab>Weekly resources</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <UsersPanel api={adminUserApi} />
          </TabPanel>
          <TabPanel px={0}>
            <ResourcesPanel api={adminResourceApi} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
