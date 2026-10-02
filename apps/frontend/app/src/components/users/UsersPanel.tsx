import {
  Badge,
  Box,
  HStack,
  Input,
  SimpleGrid,
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
import { useCallback, useEffect, useState } from "react";

import { errorMessage, type UserApi, type UserSummary } from "../../api/userManagement";
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
function UserCard({ user, onOpen }: { user: UserSummary; onOpen: () => void }) {
  return (
    <Box borderWidth="1px" borderRadius="md" p={3} cursor="pointer" onClick={onOpen} _hover={{ borderColor: "blue.400" }}>
      <HStack align="start" spacing={2} mb={2}>
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

export function UsersPanel({ api }: { api: UserApi }) {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserSummary[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const load = useCallback(() => {
    api
      .listUsers(search.trim())
      .then(setUsers)
      .catch((e) => toast({ status: "error", title: errorMessage(e, "Could not load users.") }));
  }, [api, search, toast]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <VStack align="stretch" spacing={4}>
      <Input placeholder="Search by email" value={search} onChange={(e) => setSearch(e.target.value)} />

      <VStack align="stretch" spacing={3} display={{ base: "flex", md: "none" }}>
        {users?.map((u) => (
          <UserCard key={u.id} user={u} onOpen={() => setSelected(u.id)} />
        ))}
      </VStack>

      <TableContainer display={{ base: "none", md: "block" }}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Progress</Th>
              <Th isNumeric>Score</Th>
              <Th isNumeric>Hints</Th>
              <Th>Last activity</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users?.map((u) => (
              <Tr key={u.id} _hover={{ bg: "gray.50" }} cursor="pointer" onClick={() => setSelected(u.id)}>
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
      {users?.length === 0 && <Text color="gray.500">No users found.</Text>}
      <UserDrawer api={api} userId={selected} onClose={() => setSelected(null)} onChanged={load} />
    </VStack>
  );
}
