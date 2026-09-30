import { Box, Button, FormControl, FormLabel, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { adminApi, getAdminToken, setAdminToken } from "../api/adminClient";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (getAdminToken()) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await adminApi.post<{ access_token: string }>("/admin/auth/login", { email, password });
      setAdminToken(response.data.access_token);
      setPassword("");
      navigate("/admin", { replace: true });
    } catch (err) {
      setPassword("");
      if (isAxiosError(err) && err.response?.status === 429) {
        setError("Too many attempts. Try again later.");
      } else {
        // Same message whether the account is not an admin, the email is wrong, or the password is wrong.
        setError("Invalid email or password.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={20}>
      <Heading size="lg" mb={6}>
        Admin sign in
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          {error && <Text color="red.500">{error}</Text>}
          <Button type="submit" colorScheme="blue" isLoading={submitting}>
            Sign in
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
