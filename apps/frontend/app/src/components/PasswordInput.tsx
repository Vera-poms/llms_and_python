import { IconButton, Input, InputGroup, InputRightElement, type InputProps } from "@chakra-ui/react";
import { useState } from "react";

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      {off && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

// Password field with a show/hide toggle. Accepts every <Input> prop; `type` is controlled by the toggle.
export function PasswordInput(props: InputProps & { required?: boolean; minLength?: number }) {
  const [visible, setVisible] = useState(false);
  return (
    <InputGroup>
      <Input {...props} type={visible ? "text" : "password"} pr="2.75rem" />
      <InputRightElement>
        <IconButton
          size="sm"
          variant="ghost"
          aria-label={visible ? "Hide password" : "Show password"}
          icon={<EyeIcon off={visible} />}
          onClick={() => setVisible((v) => !v)}
        />
      </InputRightElement>
    </InputGroup>
  );
}
