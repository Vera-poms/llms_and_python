import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Heading, Input, Link, Text, VStack } from "@chakra-ui/react";
import { isAxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { Link as RouterLink, Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { adminApi, getAdminToken, setAdminToken } from "../api/adminClient";
import { PasswordInput } from "../components/PasswordInput";

const MIN_PASSWORD_LENGTH = 12;

function signupError(err: unknown): string {
  if (isAxiosError(err)) {
    const status = err.response?.status;
    const detail = err.response?.data?.detail;
    if (status === 429) return "Too many attempts. Try again later.";
    if (status === 409 || status === 422) return typeof detail === "string" ? detail : "Check your details and try again.";
    if (status === 403) return "This invite code is invalid, expired or already used, or it belongs to a different email.";
  }
  return "Could not create the admin account. Try again.";
}

export function AdminSignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [inviteCode, setInviteCode] = useState(searchParams.get("code") ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (getAdminToken()) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      const response = await adminApi.post<{ access_token: string }>("/admin/auth/signup", {
        email,
        password,
        invite_code: inviteCode.trim(),
      });
      setAdminToken(response.data.access_token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setPassword("");
      setConfirmPassword("");
      setError(signupError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box maxW="sm" mx="auto" mt={{ base: 8, md: 20 }} px={{ base: 4, md: 0 }} pb={10}>
      <Heading size="lg" mb={6}>
        Admin sign up
      </Heading>
      <form onSubmit={handleSubmit} aria-busy={submitting}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input isDisabled={submitting} autoFocus type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </FormControl>
          <FormControl>
            <FormLabel>Invite code</FormLabel>
            <Input isDisabled={submitting} value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} autoComplete="off" required />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <PasswordInput
              isDisabled={submitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Confirm password</FormLabel>
            <PasswordInput
              isDisabled={submitting}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </FormControl>
          {error && (
            <Alert status="error" borderRadius="md" role="alert">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <Button type="submit" colorScheme="blue" isLoading={submitting} loadingText="Creating account…">
            Create admin account
          </Button>
        </VStack>
      </form>
      <Text mt={4}>
        Already an admin?{" "}
        <Link as={RouterLink} to="/admin/login" color="blue.500">
          Sign in
        </Link>
      </Text>
    </Box>
  );
}
