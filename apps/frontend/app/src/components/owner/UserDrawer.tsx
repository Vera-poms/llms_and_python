import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Spinner,
  Switch,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import {
  deleteUser,
  errorMessage,
  getUser,
  resetProgress,
  setLabDone,
  updateUser,
  type UserDetail,
} from "../../api/ownerEndpoints";

const MIN_PASSWORD = 8;

interface Props {
  userId: number | null;
  onClose: () => void;
  onChanged: () => void;
}

export function UserDrawer({ userId, onClose, onChanged }: Props) {
  const toast = useToast();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState<"delete" | "reset" | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setUser(null);
    setPassword("");
    if (userId === null) return;
    getUser(userId)
      .then(setUser)
      .catch((e) => {
        toast({ status: "error", title: errorMessage(e, "Could not load user.") });
        onClose();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function run(action: () => Promise<unknown>, success: string, refresh = true): Promise<boolean> {
    try {
      await action();
      toast({ status: "success", title: success });
      if (userId !== null && refresh) setUser(await getUser(userId));
      onChanged();
      return true;
    } catch (e) {
      toast({ status: "error", title: errorMessage(e) });
      return false;
    }
  }

  async function savePassword() {
    if (!user) return;
    if (await run(() => updateUser(user.id, { new_password: password }), "Password updated")) {
      setPassword("");
    }
  }

  async function confirmed() {
    const kind = confirm;
    setConfirm(null);
    if (!user || !kind) return;
    if (kind === "delete") {
      if (await run(() => deleteUser(user.id), "User deleted", false)) onClose();
    } else {
      await run(() => resetProgress(user.id), "Progress reset");
    }
  }

  return (
    <>
      <Drawer isOpen={userId !== null} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{user?.email ?? "User"}</DrawerHeader>
          <DrawerBody pb={8}>
            {!user ? (
              <Spinner />
            ) : (
              <VStack align="stretch" spacing={6}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb={0}>Admin access</FormLabel>
                  <Switch
                    isChecked={user.is_admin}
                    onChange={(e) =>
                      run(() => updateUser(user.id, { is_admin: e.target.checked }), "Admin access updated")
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Set new password</FormLabel>
                  <HStack>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button isDisabled={password.length < MIN_PASSWORD} onClick={savePassword}>
                      Save
                    </Button>
                  </HStack>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    At least {MIN_PASSWORD} characters.
                  </Text>
                </FormControl>

                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">
                      Progress ({user.labs_done}/{user.total_labs} labs, {user.hints_used} hints)
                    </Text>
                    <Button size="xs" variant="outline" onClick={() => setConfirm("reset")}>
                      Reset all
                    </Button>
                  </HStack>
                  {user.labs.map((lab) => (
                    <HStack key={lab.lab_id} justify="space-between">
                      <Text fontSize="sm">
                        {lab.title} {lab.hint_count > 0 && <Badge>{lab.hint_count} hints</Badge>}
                      </Text>
                      <Switch
                        isChecked={lab.done}
                        onChange={(e) =>
                          run(() => setLabDone(user.id, lab.lab_id, e.target.checked), "Progress updated")
                        }
                      />
                    </HStack>
                  ))}
                </VStack>

                <Button colorScheme="red" variant="outline" onClick={() => setConfirm("delete")}>
                  Delete user
                </Button>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <AlertDialog isOpen={confirm !== null} leastDestructiveRef={cancelRef} onClose={() => setConfirm(null)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>{confirm === "delete" ? "Delete user?" : "Reset progress?"}</AlertDialogHeader>
            <AlertDialogBody>
              {confirm === "delete"
                ? `This permanently deletes ${user?.email} and all their code and progress.`
                : `This clears all lab progress and saved position for ${user?.email}.`}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setConfirm(null)}>
                Cancel
              </Button>
              <Button colorScheme="red" ml={3} onClick={confirmed}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
