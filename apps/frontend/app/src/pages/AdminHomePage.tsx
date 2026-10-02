import { Box, Button, HStack, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { adminResourceApi, adminUserApi } from "../api/adminEndpoints";
import { setAdminToken } from "../api/adminClient";
import { MobileNav, NavList, StickyHeader } from "../components/MobileNav";
import { ResourcesPanel } from "../components/resources/ResourcesPanel";
import { UsersPanel } from "../components/users/UsersPanel";

const TABS = ["Users", "Weekly resources"];

export function AdminHomePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  function logout() {
    setAdminToken(null);
    navigate("/admin/login", { replace: true });
  }

  return (
    <Box maxW="4xl" mx="auto" mt={{ base: 4, md: 10 }} px={{ base: 3, md: 4 }} pb={16}>
      <StickyHeader>
        <HStack minW={0} spacing={3}>
          <MobileNav title="Admin sections">
            {(close) => (
              <NavList
                items={TABS}
                active={tab}
                onSelect={(i) => {
                  setTab(i);
                  close();
                }}
              />
            )}
          </MobileNav>
          <Heading size={{ base: "sm", md: "lg" }} minW={0} noOfLines={1}>
            {/* On phones the drawer holds the section names, so the header names the open one. */}
            <Box as="span" display={{ base: "none", md: "inline" }}>
              Admin dashboard
            </Box>
            <Box as="span" display={{ base: "inline", md: "none" }}>
              {TABS[tab]}
            </Box>
          </Heading>
        </HStack>
        <Button size="sm" flexShrink={0} onClick={logout}>
          Sign out
        </Button>
      </StickyHeader>
      <Tabs index={tab} onChange={setTab} isLazy>
        <TabList display={{ base: "none", md: "flex" }}>
          {TABS.map((label) => (
            <Tab key={label}>{label}</Tab>
          ))}
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
