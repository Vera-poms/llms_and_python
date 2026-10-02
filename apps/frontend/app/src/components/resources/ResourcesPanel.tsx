import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Switch,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Resource, ResourceApi, ResourceBlock, ResourceDraft } from "../../api/resourceManagement";
import { errorMessage } from "../../api/userManagement";
import { WeekNav } from "../WeekNav";
import { ResourceRenderer } from "./ResourceRenderer";

const EMPTY_DRAFT: ResourceDraft = { week: 2, title: "", summary: "", position: 0, blocks: [] };

function newBlock(type: ResourceBlock["type"]): ResourceBlock {
  if (type === "text") return { type, markdown: "" };
  if (type === "code") return { type, code: "", runnable: true };
  return { type, url: "", title: "", note: "" };
}

function BlockEditor({
  block,
  index,
  count,
  onChange,
  onMove,
  onRemove,
}: {
  block: ResourceBlock;
  index: number;
  count: number;
  onChange: (b: ResourceBlock) => void;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <Box borderWidth="1px" borderRadius="md" p={3}>
      <HStack justify="space-between" mb={2}>
        <Badge colorScheme={block.type === "text" ? "blue" : block.type === "code" ? "purple" : "teal"}>
          {block.type}
        </Badge>
        <HStack spacing={1}>
          <IconButton aria-label="Move up" size="xs" icon={<>↑</>} isDisabled={index === 0} onClick={() => onMove(-1)} />
          <IconButton
            aria-label="Move down"
            size="xs"
            icon={<>↓</>}
            isDisabled={index === count - 1}
            onClick={() => onMove(1)}
          />
          <Button size="xs" colorScheme="red" variant="outline" onClick={onRemove}>
            Remove
          </Button>
        </HStack>
      </HStack>
      {block.type === "text" && (
        <Textarea
          rows={6}
          placeholder="Markdown text. Paste links anywhere; they are styled automatically."
          value={block.markdown}
          onChange={(e) => onChange({ ...block, markdown: e.target.value })}
        />
      )}
      {block.type === "code" && (
        <VStack align="stretch" spacing={2}>
          <Textarea
            rows={6}
            fontFamily="mono"
            fontSize="sm"
            placeholder="Python code"
            value={block.code}
            onChange={(e) => onChange({ ...block, code: e.target.value })}
          />
          <FormControl display="flex" alignItems="center">
            <FormLabel mb={0} fontSize="sm">
              Students can run this code
            </FormLabel>
            <Switch isChecked={block.runnable} onChange={(e) => onChange({ ...block, runnable: e.target.checked })} />
          </FormControl>
        </VStack>
      )}
      {block.type === "link" && (
        <VStack align="stretch" spacing={2}>
          <Input placeholder="https://..." value={block.url} onChange={(e) => onChange({ ...block, url: e.target.value })} />
          <Input
            placeholder="Title (optional)"
            value={block.title ?? ""}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
          />
          <Input
            placeholder="Note (optional)"
            value={block.note ?? ""}
            onChange={(e) => onChange({ ...block, note: e.target.value })}
          />
        </VStack>
      )}
    </Box>
  );
}

function ResourceEditor({
  api,
  initial,
  onSaved,
  onCancel,
}: {
  api: ResourceApi;
  initial: { id: number | null; draft: ResourceDraft };
  onSaved: () => void;
  onCancel: () => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState<ResourceDraft>(initial.draft);
  const [saving, setSaving] = useState(false);

  function setBlock(i: number, block: ResourceBlock) {
    setDraft((d) => ({ ...d, blocks: d.blocks.map((b, j) => (j === i ? block : b)) }));
  }

  function moveBlock(i: number, delta: -1 | 1) {
    setDraft((d) => {
      const blocks = [...d.blocks];
      [blocks[i], blocks[i + delta]] = [blocks[i + delta], blocks[i]];
      return { ...d, blocks };
    });
  }

  async function save() {
    setSaving(true);
    try {
      // Empty blocks are dropped rather than rejected, so a stray "+ text" click is harmless.
      const blocks = draft.blocks.filter((b) =>
        b.type === "text" ? b.markdown.trim() : b.type === "code" ? b.code.trim() : b.url.trim(),
      );
      const body = { ...draft, blocks };
      if (initial.id === null) await api.create(body);
      else await api.update(initial.id, body);
      toast({ status: "success", title: "Saved." });
      onSaved();
    } catch (e) {
      const detail = (e as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
      // FastAPI validation errors arrive as a list of {msg, loc}.
      const message = Array.isArray(detail)
        ? detail.map((d: { msg?: string }) => d.msg).join("; ")
        : errorMessage(e, "Could not save.");
      toast({ status: "error", title: message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <VStack align="stretch" spacing={4}>
      <Stack direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "end" }} spacing={3}>
        <FormControl w={{ base: "full", sm: "28" }}>
          <FormLabel>Week</FormLabel>
          <NumberInput min={2} max={52} value={draft.week} onChange={(_s, n) => setDraft({ ...draft, week: n || 2 })}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </FormControl>
      </Stack>
      <FormControl>
        <FormLabel>Summary</FormLabel>
        <Input value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
      </FormControl>

      <Heading size="sm">Content</Heading>
      {draft.blocks.map((block, i) => (
        <BlockEditor
          key={i}
          block={block}
          index={i}
          count={draft.blocks.length}
          onChange={(b) => setBlock(i, b)}
          onMove={(d) => moveBlock(i, d)}
          onRemove={() => setDraft({ ...draft, blocks: draft.blocks.filter((_, j) => j !== i) })}
        />
      ))}
      <HStack wrap="wrap" spacing={2}>
        {(["text", "code", "link"] as const).map((type) => (
          <Button
            key={type}
            size="sm"
            variant="outline"
            onClick={() => setDraft({ ...draft, blocks: [...draft.blocks, newBlock(type)] })}
          >
            + {type}
          </Button>
        ))}
      </HStack>

      <Heading size="sm">Preview</Heading>
      <Box borderWidth="1px" borderRadius="md" p={{ base: 3, md: 4 }} minW={0}>
        <Heading size="md" mb={1}>
          {draft.title || "Untitled"}
        </Heading>
        {draft.summary && (
          <Text color="gray.600" _dark={{ color: "gray.300" }} mb={3}>
            {draft.summary}
          </Text>
        )}
        <ResourceRenderer blocks={draft.blocks} run={api.run} />
      </Box>

      <HStack justify="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button colorScheme="blue" onClick={save} isLoading={saving} isDisabled={!draft.title.trim()}>
          Save
        </Button>
      </HStack>
    </VStack>
  );
}

export function ResourcesPanel({ api }: { api: ResourceApi }) {
  const toast = useToast();
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [week, setWeek] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ id: number | null; draft: ResourceDraft } | null>(null);
  const [deleting, setDeleting] = useState<Resource | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const load = useCallback(() => {
    api
      .list()
      .then(setResources)
      .catch((e) => toast({ status: "error", title: errorMessage(e, "Could not load resources.") }));
  }, [api, toast]);

  useEffect(load, [load]);

  const weeks = useMemo(() => {
    const hasDraft = new Map<number, boolean>();
    for (const r of resources ?? []) hasDraft.set(r.week, (hasDraft.get(r.week) ?? false) || r.released_at === null);
    return [...hasDraft.entries()].sort((a, b) => a[0] - b[0]).map(([w, draft]) => ({ week: w, draft }));
  }, [resources]);

  const activeWeek = week !== null && weeks.some((w) => w.week === week) ? week : weeks[0]?.week;

  async function act(action: () => Promise<unknown>, success: string) {
    try {
      await action();
      toast({ status: "success", title: success });
      load();
    } catch (e) {
      toast({ status: "error", title: errorMessage(e, "Action failed.") });
    }
  }

  if (editing) {
    return (
      <ResourceEditor
        api={api}
        initial={editing}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setWeek(editing.draft.week);
          setEditing(null);
          load();
        }}
      />
    );
  }

  const visible = (resources ?? []).filter((r) => r.week === activeWeek);

  return (
    <VStack align="stretch" spacing={4}>
      <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "stretch", sm: "center" }} spacing={3}>
        <Text color="gray.600" _dark={{ color: "gray.300" }} fontSize="sm">
          Week 1 is the existing labs. Resources added here start in Week 2 and are hidden from students until released.
        </Text>
        <Button
          colorScheme="blue"
          size="sm"
          onClick={() => setEditing({ id: null, draft: { ...EMPTY_DRAFT, week: activeWeek ?? 2 } })}
        >
          New resource
        </Button>
      </Stack>

      {resources && weeks.length === 0 && <Text>No weekly resources yet.</Text>}
      {weeks.length > 0 && activeWeek !== undefined && (
        <WeekNav weeks={weeks} active={activeWeek} onChange={setWeek} />
      )}

      {visible.map((r) => (
        <Box key={r.id} borderWidth="1px" borderRadius="md" p={{ base: 3, md: 4 }} minW={0}>
          {/* align must stay "stretch" while stacked: "start" would size the title box to its
              content and push it past the viewport. */}
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "stretch", md: "start" }}
            mb={3}
            spacing={3}
          >
            <Box minW={0}>
              <Heading size={{ base: "sm", md: "md" }}>{r.title}</Heading>
              {r.summary && (
                <Text color="gray.600" _dark={{ color: "gray.300" }}>
                  {r.summary}
                </Text>
              )}
            </Box>
            <HStack wrap="wrap" spacing={2}>
              <Badge colorScheme={r.released_at ? "green" : "orange"}>{r.released_at ? "Released" : "Draft"}</Badge>
              <Button
                size="xs"
                onClick={() =>
                  setEditing({
                    id: r.id,
                    draft: { week: r.week, title: r.title, summary: r.summary, position: r.position, blocks: r.blocks },
                  })
                }
              >
                Edit
              </Button>
              <Button
                size="xs"
                colorScheme={r.released_at ? "gray" : "green"}
                onClick={() =>
                  act(
                    () => (r.released_at ? api.unrelease(r.id) : api.release(r.id)),
                    r.released_at ? "Moved back to draft." : "Released to students.",
                  )
                }
              >
                {r.released_at ? "Unrelease" : "Release"}
              </Button>
              <Button size="xs" colorScheme="red" variant="outline" onClick={() => setDeleting(r)}>
                Delete
              </Button>
            </HStack>
          </Stack>
          <ResourceRenderer blocks={r.blocks} run={api.run} />
        </Box>
      ))}

      <AlertDialog isOpen={deleting !== null} leastDestructiveRef={cancelRef} onClose={() => setDeleting(null)}>
        <AlertDialogOverlay>
          <AlertDialogContent mx={4}>
            <AlertDialogHeader>Delete resource</AlertDialogHeader>
            <AlertDialogBody wordBreak="break-word">Delete "{deleting?.title}"? This cannot be undone.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeleting(null)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={() => {
                  const target = deleting;
                  setDeleting(null);
                  if (target) act(() => api.remove(target.id), "Deleted.");
                }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
}
