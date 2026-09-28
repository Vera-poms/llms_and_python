import { Button } from "@chakra-ui/react";

// Local dev convenience: this app runs on the same machine as the course repo,
// so a vscode:// deep link can open the file directly in the host editor.
const REPO_ROOT = "C:/Users/Verap/Documents/llms_and_python";

interface OpenFileLinkProps {
  path: string; // repo-relative, e.g. "course/lab_01_probability/exercise.py"
  label?: string;
}

export function OpenFileLink({ path, label }: OpenFileLinkProps) {
  const href = `vscode://file/${REPO_ROOT}/${path}`;
  return (
    <Button as="a" href={href} size="xs" variant="outline" colorScheme="blue" ml={2}>
      {label ?? `Open ${path.split("/").pop()}`}
    </Button>
  );
}
