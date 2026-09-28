import { Box, Button, FormControl, FormLabel, Heading, Input, Link, Text, VStack } from "@chakra-ui/react";
import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

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
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={20}>
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
            <Input
              type="password"
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
        No account?{" "}
        <Link as={RouterLink} to="/signup" color="blue.500">
          Sign up
        </Link>
      </Text>
    </Box>
  );
}
