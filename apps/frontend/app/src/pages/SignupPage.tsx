import { Box, Button, FormControl, FormLabel, Heading, Input, Link, Text, VStack } from "@chakra-ui/react";
import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await signup(email, password);
      navigate("/labs");
    } catch {
      setError("Could not create an account with that email.");
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={20}>
      <Heading size="lg" mb={6}>
        Sign up
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
              minLength={8}
            />
          </FormControl>
          {error && <Text color="red.500">{error}</Text>}
          <Button type="submit" colorScheme="blue">
            Create account
          </Button>
        </VStack>
      </form>
      <Text mt={4}>
        Already have an account?{" "}
        <Link as={RouterLink} to="/login" color="blue.500">
          Log in
        </Link>
      </Text>
    </Box>
  );
}
