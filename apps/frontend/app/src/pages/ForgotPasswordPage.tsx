import { Box, Button, FormControl, FormLabel, Heading, Input, Link, Text, VStack } from "@chakra-ui/react";
import { useState, type FormEvent } from "react";
import { Link as RouterLink } from "react-router-dom";

import { api } from "../api/client";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expiresInMinutes, setExpiresInMinutes] = useState<number | null>(null);
  const sent = expiresInMinutes !== null;
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await api.post<{ expires_in_minutes: number }>("/auth/forgot-password", { email });
      setExpiresInMinutes(response.data.expires_in_minutes);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={20}>
      <Heading size="lg" mb={6}>
        Forgot password
      </Heading>
      {sent ? (
        <VStack spacing={4} align="stretch">
          <Text>If that email is registered, we've sent a reset token to it. It expires in {expiresInMinutes} minutes.</Text>
          <Button as={RouterLink} to="/reset-password" colorScheme="blue">
            I have my token
          </Button>
        </VStack>
      ) : (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <Text>Enter your email and we'll send you a token to reset your password.</Text>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </FormControl>
            {error && <Text color="red.500">{error}</Text>}
            <Button type="submit" colorScheme="blue" isLoading={submitting}>
              Send reset token
            </Button>
          </VStack>
        </form>
      )}
      <Text mt={4}>
        <Link as={RouterLink} to="/login" color="blue.500">
          Back to log in
        </Link>
      </Text>
    </Box>
  );
}
