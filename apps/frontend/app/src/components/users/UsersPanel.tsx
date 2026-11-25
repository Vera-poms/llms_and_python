import {
  Badge,
  Box,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
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

      {users === null && loading && <LoadingSpinner label="Loading users…" />}

      <VStack align="stretch" spacing={3} display={{ base: "flex", md: "none" }}>
        {users?.map((u, i) => (
          <UserCard key={u.id} user={u} number={i + 1} onOpen={() => setSelected(u.id)} />
        ))}
      </VStack>

      {/* A sticky header only works if no box between it and the scroll area clips overflow, so
          the container's own scrolling is turned off when the header must stick. */}
      <TableContainer display={{ base: "none", md: "block" }} overflow={stickySearch ? "visible" : undefined}>
        {/* "separate" borders, because collapsed borders stay behind when a header cell sticks. */}
        <Table size="sm" sx={stickySearch ? { borderCollapse: "separate", borderSpacing: 0 } : undefined}>
          <Thead>
            <Tr
              sx={
                stickySearch
                  ? {
                      "& > th": {
                        position: "sticky",
                        // Height of the sticky search box above: input (2.5rem) + its bottom padding (0.5rem).
                        top: "3rem",
                        zIndex: 1,
                        bg: "chakra-body-bg",
                      },
                    }
                  : undefined
              }
            >
              <Th isNumeric w="1%">
                #
              </Th>
              <Th>Email</Th>
              <Th>Progress</Th>
              <Th isNumeric>Score</Th>
              <Th isNumeric>Hints</Th>
              <Th>Last activity</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.map((u, i) => (
              <Tr key={u.id} _hover={{ bg: "gray.50" }} cursor="pointer" onClick={() => setSelected(u.id)}>
                <Td isNumeric color="gray.500">
                  {i + 1}
                </Td>
                <Td>
                  {u.email} {u.is_admin && <Badge colorScheme="purple">admin</Badge>}
                </Td>
                <Td>
                  {u.labs_done}/{u.total_labs}
                </Td>
                <Td isNumeric>{u.score_percent ?? 0}%</Td>
                <Td isNumeric>{u.hints_used}</Td>
                <Td>{u.last_activity ? new Date(u.last_activity).toLocaleString() : "—"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {users?.length === 0 && !loading && <Text color="gray.500">No users found.</Text>}
      <UserDrawer api={api} userId={selected} onClose={() => setSelected(null)} onChanged={load} />
    </VStack>
  );
}
