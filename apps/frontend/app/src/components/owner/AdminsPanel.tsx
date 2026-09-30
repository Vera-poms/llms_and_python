import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Button,
  Code,
  Heading,
  HStack,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  createInvite,
  errorMessage,
  listAdmins,
  listInvites,
  revokeAdmin,
  revokeInvite,
  type AdminAccount,
  type Invite,
  type InviteCreated,
} from "../../api/ownerEndpoints";

const STATUS_COLOR = { pending: "blue", used: "green", revoked: "gray", expired: "orange" } as const;

export function AdminsPanel() {
  const toast = useToast();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [created, setCreated] = useState<InviteCreated | null>(null);

  const load = useCallback(() => {
    Promise.all([listAdmins(), listInvites()])
      .then(([a, i]) => {
        setAdmins(a);
        setInvites(i);
      })
      .catch((e) => toast({ status: "error", title: errorMessage(e, "Could not load admins.") }));
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function run(action: () => Promise<unknown>, success: string) {
    try {
      await action();
      toast({ status: "success", title: success });
      load();
    } catch (e) {
      toast({ status: "error", title: errorMessage(e) });
    }
  }

  async function invite(event: FormEvent) {
    event.preventDefault();
    try {
      setCreated(await createInvite(email));
      setEmail("");
      load();
    } catch (e) {
      toast({ status: "error", title: errorMessage(e, "Could not create invite.") });
    }
  }

  return (
    <VStack align="stretch" spacing={8}>
      <VStack align="stretch" spacing={3}>
        <Heading size="sm">Invite an admin</Heading>
        <form onSubmit={invite}>
          <HStack>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" colorScheme="blue">
              Send invite
            </Button>
          </HStack>
        </form>
        {created && (
          <Alert status={created.emailed ? "success" : "warning"} alignItems="flex-start">
            <AlertIcon />
            <AlertDescription>
              {created.emailed ? "Invite emailed." : "Email not sent — share this code yourself."} Code (shown once):{" "}
              <Code wordBreak="break-all">{created.code}</Code>
            </AlertDescription>
          </Alert>
        )}
      </VStack>

      <VStack align="stretch" spacing={2}>
        <Heading size="sm">Admins</Heading>
        <TableContainer>
          <Table size="sm">
            <Tbody>
              {admins.map((a) => (
                <Tr key={a.id}>
                  <Td>{a.email}</Td>
                  <Td isNumeric>
                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="outline"
                      onClick={() =>
                        window.confirm(`Revoke admin access for ${a.email}?`) &&
                        run(() => revokeAdmin(a.id), "Admin revoked")
                      }
                    >
                      Revoke
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>

      <VStack align="stretch" spacing={2}>
        <Heading size="sm">Invites</Heading>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Status</Th>
                <Th>Expires</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {invites.map((i) => (
                <Tr key={i.id}>
                  <Td>{i.email}</Td>
                  <Td>
                    <Badge colorScheme={STATUS_COLOR[i.status]}>{i.status}</Badge>
                  </Td>
                  <Td>{new Date(i.expires_at).toLocaleString()}</Td>
                  <Td isNumeric>
                    {i.status === "pending" && (
                      <Button size="xs" variant="outline" onClick={() => run(() => revokeInvite(i.id), "Invite revoked")}>
                        Revoke
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </VStack>
  );
}
