import {
  Alert,
  AlertDescription,
  AlertIcon,
  Badge,
  Button,
  Code,
  Box,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
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
          <Stack direction={{ base: "column", sm: "row" }}>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" colorScheme="blue" flexShrink={0}>
              Send invite
            </Button>
          </Stack>
        </form>
        {created && (
          <Alert status={created.emailed ? "success" : "warning"} alignItems="flex-start">
            <AlertIcon />
            <AlertDescription minW={0} fontSize="sm">
              {created.emailed ? "Invite emailed." : "Email not sent — share this link yourself."} Link (shown once):{" "}
              <Code wordBreak="break-all" data-testid="invite-link">
                {`${window.location.origin}/admin/signup?${new URLSearchParams({ email: created.email, code: created.code })}`}
              </Code>
            </AlertDescription>
          </Alert>
        )}
      </VStack>

      <VStack align="stretch" spacing={2}>
        <Heading size="sm">Admins</Heading>
        {admins.map((a) => (
          <Stack
            key={a.id}
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "stretch", sm: "center" }}
            spacing={2}
            borderBottomWidth="1px"
            py={2}
          >
            <Text fontSize="sm" wordBreak="break-all" minW={0}>
              {a.email}
            </Text>
            <Button
              size="xs"
              colorScheme="red"
              variant="outline"
              alignSelf={{ base: "start", sm: "center" }}
              flexShrink={0}
              onClick={() =>
                window.confirm(`Revoke admin access for ${a.email}?`) && run(() => revokeAdmin(a.id), "Admin revoked")
              }
            >
              Revoke
            </Button>
          </Stack>
        ))}
      </VStack>

      <VStack align="stretch" spacing={2}>
        <Heading size="sm">Invites</Heading>
        {/* A four-column table is unreadable at phone width, so each invite becomes a stacked row. */}
        {invites.map((i) => (
          <Box key={i.id} borderBottomWidth="1px" py={2}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              align={{ base: "stretch", sm: "center" }}
              spacing={2}
            >
              <Text fontSize="sm" wordBreak="break-all" minW={0}>
                {i.email}
              </Text>
              {i.status === "pending" && (
                <Button
                  size="xs"
                  variant="outline"
                  alignSelf={{ base: "start", sm: "center" }}
                  flexShrink={0}
                  onClick={() => run(() => revokeInvite(i.id), "Invite revoked")}
                >
                  Revoke
                </Button>
              )}
            </Stack>
            <HStack spacing={2} mt={1}>
              <Badge colorScheme={STATUS_COLOR[i.status]}>{i.status}</Badge>
              <Text fontSize="xs" color="gray.500">
                expires {new Date(i.expires_at).toLocaleDateString()}
              </Text>
            </HStack>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
