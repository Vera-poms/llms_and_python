import { Badge, Tab, TabList, Tabs } from "@chakra-ui/react";

export interface WeekTab {
  week: number;
  draft?: boolean;
}

// Tab bar only; the page renders the selected week's content beneath it.
export function WeekNav({
  weeks,
  active,
  onChange,
}: {
  weeks: WeekTab[];
  active: number;
  onChange: (week: number) => void;
}) {
  const index = Math.max(0, weeks.findIndex((w) => w.week === active));
  return (
    <Tabs index={index} onChange={(i) => onChange(weeks[i].week)} variant="line" colorScheme="blue" isLazy>
      <TabList overflowX="auto" overflowY="hidden">
        {weeks.map((w) => (
          <Tab key={w.week} whiteSpace="nowrap">
            Week {w.week}
            {w.draft && (
              <Badge ml={2} colorScheme="orange">
                Draft
              </Badge>
            )}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}
