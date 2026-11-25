import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Progress,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { MAX_WPM, MIN_WPM, ReadingMode, SPEED_PRESETS } from "../hooks/useReadingMode";

// The button that turns reading mode on.
export function ReadingModeButton({ mode }: { mode: ReadingMode }) {
  if (mode.active) return null;
  return (
    <Button size="sm" variant="outline" onClick={mode.start}>
      Reading mode
    </Button>
  );
}

// Floating controls while reading mode is on: play/pause, speed and "show all".
export function ReadingModeBar({ mode }: { mode: ReadingMode }) {
  const bg = useColorModeValue("white", "gray.800");
  if (!mode.active) return null;
  const done = mode.progress >= 100;

  return (
    <Box
      position="fixed"
      bottom={{ base: 3, md: 6 }}
      left="50%"
      transform="translateX(-50%)"
      zIndex="overlay"
      w={{ base: "calc(100% - 24px)", md: "xl" }}
      bg={bg}
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="xl"
      p={3}
      role="region"
      aria-label="Reading mode controls"
    >
      <Progress value={mode.progress} size="xs" borderRadius="full" mb={3} aria-label="Reading progress" />
      <HStack spacing={3} flexWrap="wrap" justify="space-between">
        <HStack spacing={2}>
          <Button size="sm" onClick={mode.paused ? mode.resume : mode.pause} isDisabled={done}>
            {mode.paused ? "Play" : "Pause"}
          </Button>
          <Button size="sm" variant="outline" onClick={mode.restart}>
            Restart
          </Button>
          {!mode.following && !done && (
            <Button size="sm" variant="outline" onClick={mode.follow}>
              Follow
            </Button>
          )}
        </HStack>

        <HStack spacing={3} flex="1" minW="200px">
          <Text fontSize="xs" whiteSpace="nowrap">
            Speed
          </Text>
          <Slider
            aria-label="Reading speed in words per minute"
            min={MIN_WPM}
            max={MAX_WPM}
            step={10}
            value={mode.speed}
            onChange={mode.setSpeed}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text fontSize="xs" whiteSpace="nowrap" minW="64px" textAlign="right">
            {mode.speed} wpm
          </Text>
        </HStack>

        <ButtonGroup size="xs" isAttached variant="outline">
          {Object.entries(SPEED_PRESETS).map(([label, wpm]) => (
            <Button key={label} onClick={() => mode.setSpeed(wpm)} isActive={mode.speed === wpm}>
              {label}
            </Button>
          ))}
        </ButtonGroup>

        <Button size="sm" variant="ghost" onClick={mode.stop}>
          Show all
        </Button>
      </HStack>
    </Box>
  );
}
