import { Box, Button, HStack, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ownerUserApi } from "../api/ownerEndpoints";
import { setOwnerToken } from "../api/ownerClient";
import { AdminsPanel } from "../components/owner/AdminsPanel";
import { ReviewsPanel } from "../components/owner/ReviewsPanel";
import { MobileNav, NavList, StickyHeader } from "../components/MobileNav";
import { UsersPanel } from "../components/users/UsersPanel";

const TABS = ["Users", "Admins & invites", "Reviews"];

export function OwnerHomePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  function logout() {
    setOwnerToken(null);
    navigate("/owner/login", { replace: true });
  }

  return (
    // The page fills the viewport and never scrolls itself: the header and tab bar stay put and
    // only the open tab's content scrolls (see TabPanels below).
    <Box
      maxW="4xl"
      mx="auto"
      h="100dvh"
      display="flex"
      flexDirection="column"
      pt={{ base: 4, md: 10 }}
      px={{ base: 3, md: 4 }}
    >
      <StickyHeader>
        <HStack minW={0} spacing={3}>
          <MobileNav title="Owner sections">
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
              Owner dashboard
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
      <Tabs index={tab} onChange={setTab} isLazy flex={1} minH={0} display="flex" flexDirection="column">
        <TabList display={{ base: "none", md: "flex" }} mb={4}>
          {TABS.map((label) => (
            <Tab key={label}>{label}</Tab>
          ))}
        </TabList>
        {/* The scroll area. The 4px side padding (cancelled by the negative margin) keeps input
            focus rings from being clipped at the edges. */}
        <TabPanels flex={1} minH={0} overflowY="auto" px={1} mx={-1}>
          <TabPanel px={0} pt={0} pb={16}>
            <UsersPanel api={ownerUserApi} stickySearch />
          </TabPanel>
          <TabPanel px={0} pt={0} pb={16}>
            <AdminsPanel />
          </TabPanel>
          <TabPanel px={0} pt={0} pb={16}>
            <ReviewsPanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
