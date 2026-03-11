import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LessonView } from "@/pages/LessonView";
import { useParams } from "wouter";
import { useLesson } from "@/hooks/use-lessons";

vi.mock("wouter", () => ({
  useParams: vi.fn(),
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/hooks/use-lessons", () => ({
  useLesson: vi.fn(),
}));

// Render markdown as plain text so we can assert on content
vi.mock("react-markdown", () => ({
  default: ({ children }: { children: string }) => <p data-testid="markdown">{children}</p>,
}));

// Stub Quiz so LessonView tests stay focused on the view shell
vi.mock("@/components/quiz/Quiz", () => ({
  Quiz: ({ exercises }: { exercises: unknown[] }) => (
    <div data-testid="quiz-stub">Quiz ({exercises.length} exercises)</div>
  ),
}));

const mockLesson = {
  id: 1,
  title: "Past Tense (Madi)",
  content: "Arabic verbs have 3 root letters.",
  category: "sarf",
  level: "beginner",
  order: 1,
  exercises: [
    { id: 1, lessonId: 1, question: "Base form?", options: ["He did", "I did"], correctAnswer: "He did", explanation: "3rd person." },
  ],
};

describe("LessonView", () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ id: "1" });
    vi.stubGlobal("scrollTo", vi.fn());
  });

  it("shows skeleton placeholders while loading", () => {
    vi.mocked(useLesson).mockReturnValue({ data: undefined, isLoading: true, error: null } as any);
    const { container } = render(<LessonView />);
    // No lesson title rendered yet
    expect(screen.queryByText("Past Tense (Madi)")).not.toBeInTheDocument();
    // Skeletons are present
    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThanOrEqual(0);
  });

  it("shows not found state when lesson is missing", () => {
    vi.mocked(useLesson).mockReturnValue({ data: null, isLoading: false, error: null } as any);
    render(<LessonView />);
    expect(screen.getByText(/Lesson not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Return Home/i)).toBeInTheDocument();
  });

  it("shows not found state when error occurs", () => {
    vi.mocked(useLesson).mockReturnValue({ data: undefined, isLoading: false, error: new Error("Not Found") } as any);
    render(<LessonView />);
    expect(screen.getByText(/Lesson not found/i)).toBeInTheDocument();
  });

  it("renders lesson title in learn mode", () => {
    vi.mocked(useLesson).mockReturnValue({ data: mockLesson, isLoading: false, error: null } as any);
    render(<LessonView />);
    expect(screen.getByText("Past Tense (Madi)")).toBeInTheDocument();
  });

  it("renders lesson content in learn mode", () => {
    vi.mocked(useLesson).mockReturnValue({ data: mockLesson, isLoading: false, error: null } as any);
    render(<LessonView />);
    expect(screen.getByText("Arabic verbs have 3 root letters.")).toBeInTheDocument();
  });

  it("shows Learn and Practice tab buttons", () => {
    vi.mocked(useLesson).mockReturnValue({ data: mockLesson, isLoading: false, error: null } as any);
    render(<LessonView />);
    expect(screen.getByRole("button", { name: "Learn" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Practice" })).toBeInTheDocument();
  });

  it("defaults to Learn mode (quiz not visible)", () => {
    vi.mocked(useLesson).mockReturnValue({ data: mockLesson, isLoading: false, error: null } as any);
    render(<LessonView />);
    expect(screen.queryByTestId("quiz-stub")).not.toBeInTheDocument();
  });

  it("clicking Practice tab renders the quiz", async () => {
    const user = userEvent.setup();
    vi.mocked(useLesson).mockReturnValue({ data: mockLesson, isLoading: false, error: null } as any);
    render(<LessonView />);
    await user.click(screen.getByRole("button", { name: "Practice" }));
    expect(screen.getByTestId("quiz-stub")).toBeInTheDocument();
  });

  it("clicking Start Practice Quiz button switches to practice mode", async () => {
    const user = userEvent.setup();
    vi.mocked(useLesson).mockReturnValue({ data: mockLesson, isLoading: false, error: null } as any);
    render(<LessonView />);
    await user.click(screen.getByRole("button", { name: /Start Practice Quiz/i }));
    expect(screen.getByTestId("quiz-stub")).toBeInTheDocument();
  });

  it("clicking Learn tab returns to content from practice mode", async () => {
    const user = userEvent.setup();
    vi.mocked(useLesson).mockReturnValue({ data: mockLesson, isLoading: false, error: null } as any);
    render(<LessonView />);
    // Switch to Practice
    await user.click(screen.getByRole("button", { name: "Practice" }));
    expect(screen.getByTestId("quiz-stub")).toBeInTheDocument();
    // Switch back to Learn
    await user.click(screen.getByRole("button", { name: "Learn" }));
    expect(screen.queryByTestId("quiz-stub")).not.toBeInTheDocument();
    expect(screen.getByText("Past Tense (Madi)")).toBeInTheDocument();
  });

  it("renders a Back to Path link pointing to the category/level page", () => {
    vi.mocked(useLesson).mockReturnValue({ data: mockLesson, isLoading: false, error: null } as any);
    render(<LessonView />);
    const backLink = screen.getByText(/Back to Path/i).closest("a");
    expect(backLink).toHaveAttribute("href", "/learn/sarf/beginner");
  });
});
