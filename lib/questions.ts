import type { Question } from "./types"

// Function to generate a set of questions about other players
export function generateQuestions(): Question[] {
  // Level 1 questions (easy)
  const level1Questions: Question[] = [
    {
      id: "q1",
      text: "What do you think is [name] favorite food?",
      level: 1,
      category: "Preferences",
    },
    {
      id: "q2",
      text: "What superpower would best suit [name] personality?",
      level: 1,
      category: "Fun",
    },
    {
      id: "q3",
      text: "What was your first impression of [name]?",
      level: 1,
      category: "Personal",
    },
  ]

  // Level 2 questions (medium)
  const level2Questions: Question[] = [
    {
      id: "q4",
      text: "What do you think is [name] biggest strength?",
      level: 2,
      category: "Character",
    },
    {
      id: "q5",
      text: "If [name] were a character in a movie, what role would they play?",
      level: 2,
      category: "Personality",
    },
    {
      id: "q6",
      text: "What kind of music do you think [name] listens to?",
      level: 2,
      category: "Interests",
    },
  ]

  // Level 3 questions (hard)
  const level3Questions: Question[] = [
    {
      id: "q7",
      text: "What do you think [name] biggest dream or ambition is?",
      level: 3,
      category: "Aspirations",
    },
    {
      id: "q8",
      text: "How do you think [name] would handle a crisis situation?",
      level: 3,
      category: "Character",
    },
    {
      id: "q9",
      text: "What life experience do you think has shaped [name] the most?",
      level: 3,
      category: "Personal",
    },
  ]

  // Combine all questions
  return [...level1Questions, ...level2Questions, ...level3Questions]
}
