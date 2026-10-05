import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Heading, Input, VStack } from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { getOwnerToken, ownerApi, setOwnerToken } from "../api/ownerClient";
import { PasswordInput } from "../components/PasswordInput";

export function OwnerLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (getOwnerToken()) {
    return <Navigate to="/owner" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const response = await ownerApi.post<{ access_token: string }>("/owner/auth/login", { email, password });
      setOwnerToken(response.data.access_token);
      setPassword("");
      navigate("/owner", { replace: true });
    } catch (err) {
      setEmail("");
      setPassword("");
      if (isAxiosError(err) && err.response?.status === 429) {
        setError("Too many attempts. Try again later.");
      } else {
        // Same message whether the owner is disabled, the email is wrong, or the password is wrong.
        setError("Invalid email or password.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={{ base: 8, md: 20 }} px={{ base: 4, md: 0 }} pb={10}>
      <Heading size="lg" mb={6}>
        Owner sign in
      </Heading>
      <form onSubmit={handleSubmit} aria-busy={submitting}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              isDisabled={submitting}
              autoFocus
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <PasswordInput
              isDisabled={submitting}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          {error && (
            <Alert status="error" borderRadius="md" role="alert">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <Button type="submit" colorScheme="blue" isLoading={submitting} loadingText="Signing in…">
            Sign in
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
