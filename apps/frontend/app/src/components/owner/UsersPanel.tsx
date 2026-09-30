import { Badge, Input, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

import { errorMessage, listUsers, type UserSummary } from "../../api/ownerEndpoints";
import { UserDrawer } from "./UserDrawer";

export function UsersPanel() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserSummary[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const load = useCallback(() => {
    listUsers(search.trim())
      .then(setUsers)
      .catch((e) => toast({ status: "error", title: errorMessage(e, "Could not load users.") }));
  }, [search, toast]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <VStack align="stretch" spacing={4}>
      <Input placeholder="Search by email" value={search} onChange={(e) => setSearch(e.target.value)} />
      <TableContainer>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Progress</Th>
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
                <Td isNumeric>{u.hints_used}</Td>
                <Td>{u.last_activity ? new Date(u.last_activity).toLocaleString() : "—"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {users?.length === 0 && <Text color="gray.500">No users found.</Text>}
      <UserDrawer userId={selected} onClose={() => setSelected(null)} onChanged={load} />
    </VStack>
  );
}
