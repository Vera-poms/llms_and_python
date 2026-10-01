import { Box, Button, FormControl, FormLabel, Heading, Input, Link, Text, VStack } from "@chakra-ui/react";
import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";

import { PasswordInput } from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(token.trim(), newPassword);
      navigate("/labs");
    } catch {
      setError("Invalid or expired reset token. Request a new one and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={20}>
      <Heading size="lg" mb={6}>
        Reset password
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Reset token</FormLabel>
            <Input value={token} onChange={(e) => setToken(e.target.value)} required />
          </FormControl>
          <FormControl>
            <FormLabel>New password</FormLabel>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Confirm new password</FormLabel>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormControl>
          {error && <Text color="red.500">{error}</Text>}
          <Button type="submit" colorScheme="blue" isLoading={submitting}>
            Reset password
          </Button>
        </VStack>
      </form>
      <Text mt={4}>
        <Link as={RouterLink} to="/forgot-password" color="blue.500">
          Need a new token?
        </Link>
      </Text>
    </Box>
  );
}
