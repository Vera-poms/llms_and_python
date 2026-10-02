import { Box, Button, FormControl, FormLabel, Heading, Input, Link, Text, VStack } from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { PasswordInput } from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/labs");
    } catch (err) {
      const detail = isAxiosError(err) ? err.response?.data?.detail : undefined;
      // "No account exists for that email" or "Incorrect password".
      setError(typeof detail === "string" ? detail : "Could not log in. Try again.");
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={{ base: 8, md: 20 }} px={{ base: 4, md: 0 }} pb={10}>
      <Heading size="lg" mb={6}>
        Log in
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          {error && <Text color="red.500">{error}</Text>}
          <Button type="submit" colorScheme="blue">
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
