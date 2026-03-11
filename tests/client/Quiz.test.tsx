import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Quiz } from "@/components/quiz/Quiz";
import { type Exercise } from "@shared/schema";

// Mock dependencies
vi.mock("wouter", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/hooks/use-progress", () => ({
  useProgress: () => ({ markLessonComplete: vi.fn() }),
}));

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockExercises: Exercise[] = [
  {
    id: 1,
    lessonId: 1,
    question: "Base form of past tense?",
    options: ["He did", "I did", "You did"],
    correctAnswer: "He did",
    explanation: "3rd person masculine singular is the root.",
  },
  {
    id: 2,
    lessonId: 1,
    question: "Standard root letter count?",
    options: ["2", "3", "4"],
    correctAnswer: "3",
    explanation: "Most Arabic verbs are triliteral.",
  },
];

describe("Quiz component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the first question", () => {
    render(<Quiz lessonId={1} exercises={mockExercises} />);
    expect(screen.getByText("Base form of past tense?")).toBeInTheDocument();
  });

  it("renders all answer options", () => {
    render(<Quiz lessonId={1} exercises={mockExercises} />);
    expect(screen.getByText("He did")).toBeInTheDocument();
    expect(screen.getByText("I did")).toBeInTheDocument();
    expect(screen.getByText("You did")).toBeInTheDocument();
  });

  it("selecting an option highlights it", async () => {
    const user = userEvent.setup();
    render(<Quiz lessonId={1} exercises={mockExercises} />);

    const option = screen.getByText("He did");
    await user.click(option);

    // The selected button should have the selected state class
    expect(option.closest("button")).toHaveClass("border-primary");
  });

  it("Check button is disabled until an option is selected", async () => {
    const user = userEvent.setup();
    render(<Quiz lessonId={1} exercises={mockExercises} />);

    const checkBtn = screen.getByRole("button", { name: /check answer/i });
    // Click without selecting — nothing should happen (no reveal)
    await user.click(checkBtn);
    expect(screen.queryByText(/correct/i)).not.toBeInTheDocument();
  });

  it("clicking correct answer then Check reveals correct state", async () => {
    const user = userEvent.setup();
    render(<Quiz lessonId={1} exercises={mockExercises} />);

    await user.click(screen.getByText("He did"));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    // The correct answer button gets success styling
    const correctBtn = screen.getByText("He did").closest("button");
    expect(correctBtn).toHaveClass("border-success");
  });

  it("clicking wrong answer then Check reveals incorrect state", async () => {
    const user = userEvent.setup();
    render(<Quiz lessonId={1} exercises={mockExercises} />);

    await user.click(screen.getByText("I did"));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    // Wrong answer gets destructive styling
    const wrongBtn = screen.getByText("I did").closest("button");
    expect(wrongBtn).toHaveClass("border-destructive");
  });

  it("answer buttons are disabled after Check is clicked", async () => {
    const user = userEvent.setup();
    render(<Quiz lessonId={1} exercises={mockExercises} />);

    await user.click(screen.getByText("He did"));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    const buttons = screen.getAllByRole("button");
    const answerButtons = buttons.filter(b =>
      ["He did", "I did", "You did"].includes(b.textContent?.trim() ?? "")
    );
    answerButtons.forEach(btn => expect(btn).toBeDisabled());
  });

  it("clicking Next advances to second question", async () => {
    const user = userEvent.setup();
    render(<Quiz lessonId={1} exercises={mockExercises} />);

    await user.click(screen.getByText("He did"));
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    await user.click(screen.getByRole("button", { name: /next question/i }));

    expect(screen.getByText("Standard root letter count?")).toBeInTheDocument();
  });

  it("shows empty state when no exercises provided", () => {
    render(<Quiz lessonId={1} exercises={[]} />);
    expect(screen.getByText(/No exercises available/i)).toBeInTheDocument();
  });

  it("option text remains visible after clicking Check Answer", async () => {
    const user = userEvent.setup();
    render(<Quiz lessonId={1} exercises={mockExercises} />);

    await user.click(screen.getByText("He did"));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    // Text must still be present in the DOM after reveal
    expect(screen.getByText("He did")).toBeInTheDocument();
    expect(screen.getByText("I did")).toBeInTheDocument();
    expect(screen.getByText("You did")).toBeInTheDocument();
  });

  it("wrong answer text remains visible after clicking Check Answer", async () => {
    const user = userEvent.setup();
    render(<Quiz lessonId={1} exercises={mockExercises} />);

    // Click a wrong answer
    await user.click(screen.getByText("I did"));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    // The wrong selected option text must still be visible
    expect(screen.getByText("I did")).toBeInTheDocument();
  });

  it("shows completion screen after finishing all exercises", async () => {
    const user = userEvent.setup();
    render(<Quiz lessonId={1} exercises={mockExercises} />);

    // Exercise 1
    await user.click(screen.getByText("He did"));
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    await user.click(screen.getByRole("button", { name: /next question/i }));

    // Exercise 2 (last)
    await user.click(screen.getByText("3"));
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    await user.click(screen.getByRole("button", { name: /finish lesson/i }));

    expect(screen.getByText(/Lesson Complete/i)).toBeInTheDocument();
  });
});
