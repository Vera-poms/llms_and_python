import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Heading, Input, Link, Text, VStack } from "@chakra-ui/react";
import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { PasswordInput } from "../components/PasswordInput";
import { useAuth } from "../context/AuthContext";

export function SignupPage() {
  const { signup } = useAuth();
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
      await signup(email, password);
      navigate("/labs");
    } catch {
      setError("Could not create an account with that email.");
      setLoading(false);
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={{ base: 8, md: 20 }} px={{ base: 4, md: 0 }} pb={10}>
      <Heading size="lg" mb={6}>
        Sign up
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
              minLength={8}
              isDisabled={loading}
            />
          </FormControl>
          {error && (
            <Alert status="error" borderRadius="md" role="alert">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <Button type="submit" colorScheme="blue" isLoading={loading} loadingText="Creating account…">
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
