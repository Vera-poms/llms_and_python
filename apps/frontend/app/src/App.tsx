import { Navigate, Route, Routes } from "react-router-dom";

import { getOwnerToken } from "./api/ownerClient";
import { useAuth } from "./context/AuthContext";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LabDetailPage } from "./pages/LabDetailPage";
import { LabListPage } from "./pages/LabListPage";
import { LoginPage } from "./pages/LoginPage";
import { OwnerHomePage } from "./pages/OwnerHomePage";
import { OwnerLoginPage } from "./pages/OwnerLoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SignupPage } from "./pages/SignupPage";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RequireOwner({ children }: { children: JSX.Element }) {
  if (!getOwnerToken()) {
    return <Navigate to="/owner/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/labs"
        element={
          <RequireAuth>
            <LabListPage />
          </RequireAuth>
        }
      />
      <Route
        path="/labs/:labId"
        element={
          <RequireAuth>
            <LabDetailPage />
          </RequireAuth>
        }
      />
      <Route path="/owner/login" element={<OwnerLoginPage />} />
      <Route
        path="/owner"
        element={
          <RequireOwner>
            <OwnerHomePage />
          </RequireOwner>
        }
      />
      <Route path="*" element={<Navigate to="/labs" replace />} />
    </Routes>
  );
}
