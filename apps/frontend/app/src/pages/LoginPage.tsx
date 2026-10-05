import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Heading, Input, Link, Text, VStack } from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { PasswordInput } from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";

function loginError(err: unknown): string {
  if (!isAxiosError(err)) return "Something went wrong. Please try again.";
  const status = err.response?.status;
  const detail = err.response?.data?.detail;
  if (!err.response) return "Can't reach the server. Check your connection and try again.";
  if (status === 404) return "No account exists for that email. Check the address or sign up.";
  if (status === 401) return "Incorrect password. Try again or reset your password.";
  if (status === 422) return "That doesn't look like a valid email address.";
  if (status === 429) return "Too many attempts. Please wait a moment and try again.";
  if (status !== undefined && status >= 500) return "The server ran into a problem. Please try again shortly.";
  return typeof detail === "string" ? detail : "Could not log in. Try again.";
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/labs");
    } catch (err) {
      setEmail("");
      setPassword("");
      setError(loginError(err));
      setLoading(false);
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={{ base: 8, md: 20 }} px={{ base: 4, md: 0 }} pb={10}>
      <Heading size="lg" mb={6}>
        Log in
      </Heading>
      <form onSubmit={handleSubmit} aria-busy={loading}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required isDisabled={loading} autoFocus />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              isDisabled={loading}
            />
          </FormControl>
          {error && (
            <Alert status="error" borderRadius="md" role="alert">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <Button type="submit" colorScheme="blue" isLoading={loading} loadingText="Logging in…">
            Log in
          </Button>
        </VStack>
      </form>
      <Text mt={4}>
        <Link as={RouterLink} to="/forgot-password" color="blue.500">
          Forgot password?
        </Link>
      </Text>
      <Text mt={2}>
        No account?{" "}
        <Link as={RouterLink} to="/signup" color="blue.500">
          Sign up
        </Link>
      </Text>
    </Box>
  );
}
