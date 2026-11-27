import {
  Badge,
  Box,
  Grid,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { errorMessage, type UserApi, type UserSummary } from "../../api/userManagement";
import { LoadingSpinner } from "../LoadingSpinner";
import { UserDrawer } from "./UserDrawer";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box minW={0}>
      <Text fontSize="xs" color="gray.500">
        {label}
      </Text>
      <Text fontSize="sm">{value}</Text>
    </Box>
  );
}

// Column widths shared by the heading row and every user row so they line up.
const COLUMNS = "2rem minmax(0, 2.6fr) 0.9fr 0.8fr 0.6fr 1.7fr";
// [label, right-aligned?]
const HEADINGS: [string, boolean][] = [
  ["#", true],
  ["Email", false],
  ["Progress", false],
  ["Score", true],
  ["Hints", true],
  ["Last activity", false],
];

// Phones get a card per user: the table's five columns don't fit, and hiding them would hide data.
function UserCard({ user, number, onOpen }: { user: UserSummary; number: number; onOpen: () => void }) {
  return (
    <Box borderWidth="1px" borderRadius="md" p={3} cursor="pointer" onClick={onOpen} _hover={{ borderColor: "blue.400" }}>
      <HStack align="start" spacing={2} mb={2}>
        <Text fontSize="sm" color="gray.500" flexShrink={0}>
          {number}.
        </Text>
        <Text fontWeight="semibold" fontSize="sm" wordBreak="break-all" minW={0}>
          {user.email}
        </Text>
        {user.is_admin && (
          <Badge colorScheme="purple" flexShrink={0}>
            admin
          </Badge>
        )}
      </HStack>
      <SimpleGrid columns={3} spacing={2}>
        <Stat label="Progress" value={`${user.labs_done}/${user.total_labs}`} />
        <Stat label="Score" value={`${user.score_percent ?? 0}%`} />
        <Stat label="Hints" value={String(user.hints_used)} />
      </SimpleGrid>
      <Text fontSize="xs" color="gray.500" mt={2}>
        Last activity: {user.last_activity ? new Date(user.last_activity).toLocaleString() : "—"}
      </Text>
    </Box>
  );
}

// `stickySearch` pins the search box to the top of the surrounding scroll area, so it stays
// reachable while the list scrolls underneath it.
// Changing `refreshKey` re-fetches the list (the page's Refresh button), keeping the search text.
export function UsersPanel({
  api,
  stickySearch = false,
  refreshKey = 0,
}: {
  api: UserApi;
  stickySearch?: boolean;
  refreshKey?: number;
}) {
  const toast = useToast();
  // Picked in JS: a `_dark` nested inside `_hover` doesn't match in Chakra, which left the hover
  // light (white) with light text in dark mode.
  const rowHover = useColorModeValue("gray.100", "gray.800");
  const headBg = useColorModeValue("gray.100", "gray.800");
  const headColor = useColorModeValue("gray.600", "gray.300");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserSummary[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  // Counts requests so a slow, older reply can't switch the spinner off while a newer one is still running.
  const latestRequest = useRef(0);

  const load = useCallback(() => {
    const request = ++latestRequest.current;
    setLoading(true);
    api
      .listUsers(search.trim())
      .then((list) => {
        if (request === latestRequest.current) setUsers(list);
      })
      .catch((e) => toast({ status: "error", title: errorMessage(e, "Could not load users.") }))
      .finally(() => {
        if (request === latestRequest.current) setLoading(false);
      });
  }, [api, search, toast]);

  useEffect(() => {
    // Show the spinner straight away; the short wait below only delays the request while typing.
    setLoading(true);
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load, refreshKey]);

  return (
    <VStack align="stretch" spacing={4}>
      <Box
        position={stickySearch ? "sticky" : undefined}
        top={0}
        zIndex={stickySearch ? 1 : undefined}
        bg="chakra-body-bg"
        pb={stickySearch ? 2 : undefined}
        mb={stickySearch ? -2 : undefined}
      >
        <InputGroup>
          <Input placeholder="Search by email" value={search} onChange={(e) => setSearch(e.target.value)} />
          {loading && users !== null && (
            <InputRightElement>
              <Spinner size="sm" color="blue.500" />
            </InputRightElement>
          )}
        </InputGroup>
      </Box>

      {loading && (users === null || users.length === 0) && <LoadingSpinner label="Loading users…" />}

      <VStack align="stretch" spacing={3} display={{ base: "flex", md: "none" }}>
        {users?.map((u, i) => (
          <UserCard key={u.id} user={u} number={i + 1} onOpen={() => setSelected(u.id)} />
        ))}
      </VStack>

      {/* Desktop list. Built from grid rows rather than a <table>: the heading row lives in its own
          box, so it can stick to the top of the scroll area as one solid bar and never slide
          over the rows, while sharing the same column widths keeps everything lined up. */}
      <Box display={{ base: "none", md: "block" }} role="table" aria-label="Users">
        <Grid
          role="row"
          templateColumns={COLUMNS}
          gap={3}
          px={3}
          py={2}
          position={stickySearch ? "sticky" : undefined}
          // Height of the sticky search box above: input (2.5rem) + its bottom padding (0.5rem).
          top={stickySearch ? "3rem" : undefined}
          zIndex={stickySearch ? 1 : undefined}
          bg={headBg}
          color={headColor}
          borderRadius="md"
          borderBottomWidth="2px"
          borderBottomColor="red.500"
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          {HEADINGS.map(([label, numeric]) => (
            <Text key={label} role="columnheader" textAlign={numeric ? "right" : "left"} noOfLines={1}>
              {label}
            </Text>
          ))}
        </Grid>
        {users?.map((u, i) => (
          <Grid
            key={u.id}
            role="row"
            templateColumns={COLUMNS}
            gap={3}
            px={3}
            py={2.5}
            alignItems="center"
            fontSize="sm"
            borderBottomWidth="1px"
            cursor="pointer"
            onClick={() => setSelected(u.id)}
            _hover={{ bg: rowHover }}
          >
            <Text role="cell" textAlign="right" color="gray.500">
              {i + 1}
            </Text>
            <HStack role="cell" spacing={2} minW={0}>
              <Text noOfLines={1} title={u.email}>
                {u.email}
              </Text>
              {u.is_admin && (
                <Badge colorScheme="purple" flexShrink={0}>
                  admin
                </Badge>
              )}
            </HStack>
            <Text role="cell">
              {u.labs_done}/{u.total_labs}
            </Text>
            <Text role="cell" textAlign="right">
              {u.score_percent ?? 0}%
            </Text>
            <Text role="cell" textAlign="right">
              {u.hints_used}
            </Text>
            <Text role="cell" noOfLines={1}>
              {u.last_activity ? new Date(u.last_activity).toLocaleString() : "—"}
            </Text>
          </Grid>
        ))}
      </Box>
      {users?.length === 0 && !loading && <Text color="gray.500">No users found.</Text>}
      <UserDrawer api={api} userId={selected} onClose={() => setSelected(null)} onChanged={load} />
    </VStack>
  );
}
