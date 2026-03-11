import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryView } from "@/pages/CategoryView";
import { useParams } from "wouter";
import { useLessons } from "@/hooks/use-lessons";

vi.mock("wouter", () => ({
  useParams: vi.fn(),
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/hooks/use-lessons", () => ({
  useLessons: vi.fn(),
}));

const mockIsLessonComplete = vi.fn(() => false);
vi.mock("@/hooks/use-progress", () => ({
  useProgress: () => ({ isLessonComplete: mockIsLessonComplete }),
}));

const mockLessons = [
  { id: 1, title: "Past Tense (Madi)", content: "...", category: "sarf", level: "beginner", order: 1 },
  { id: 2, title: "Present Tense (Mudari)", content: "...", category: "sarf", level: "beginner", order: 2 },
];

describe("CategoryView", () => {
  beforeEach(() => {
    vi.mocked(useParams).mockReturnValue({ category: "sarf", level: "beginner" });
    mockIsLessonComplete.mockReturnValue(false);
  });

  it("renders the category and level heading", () => {
    vi.mocked(useLessons).mockReturnValue({ data: mockLessons, isLoading: false, error: null } as any);
    render(<CategoryView />);
    expect(screen.getByText(/Sarf/i)).toBeInTheDocument();
    expect(screen.getByText(/Beginner/i)).toBeInTheDocument();
  });

  it("renders a Back to Categories link", () => {
    vi.mocked(useLessons).mockReturnValue({ data: mockLessons, isLoading: false, error: null } as any);
    render(<CategoryView />);
    expect(screen.getByText(/Back to Categories/i)).toBeInTheDocument();
  });

  it("shows skeleton placeholders while loading", () => {
    vi.mocked(useLessons).mockReturnValue({ data: undefined, isLoading: true, error: null } as any);
    const { container } = render(<CategoryView />);
    // Skeleton divs are rendered — heading should still show
    expect(screen.getByText(/Sarf/i)).toBeInTheDocument();
    // No lesson titles should appear yet
    expect(screen.queryByText("Past Tense (Madi)")).not.toBeInTheDocument();
  });

  it("shows error message when fetch fails", () => {
    vi.mocked(useLessons).mockReturnValue({ data: undefined, isLoading: false, error: new Error("Network Error") } as any);
    render(<CategoryView />);
    expect(screen.getByText(/Failed to load lessons/i)).toBeInTheDocument();
  });

  it("shows Coming Soon when lessons array is empty", () => {
    vi.mocked(useLessons).mockReturnValue({ data: [], isLoading: false, error: null } as any);
    render(<CategoryView />);
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
  });

  it("renders lesson titles when data loads", () => {
    vi.mocked(useLessons).mockReturnValue({ data: mockLessons, isLoading: false, error: null } as any);
    render(<CategoryView />);
    expect(screen.getByText("Past Tense (Madi)")).toBeInTheDocument();
    expect(screen.getByText("Present Tense (Mudari)")).toBeInTheDocument();
  });

  it("shows lesson number badge for incomplete lessons", () => {
    vi.mocked(useLessons).mockReturnValue({ data: mockLessons, isLoading: false, error: null } as any);
    mockIsLessonComplete.mockReturnValue(false);
    render(<CategoryView />);
    // Lesson numbers 1 and 2 are shown as text in the circle
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("links each lesson to /lesson/:id", () => {
    vi.mocked(useLessons).mockReturnValue({ data: mockLessons, isLoading: false, error: null } as any);
    render(<CategoryView />);
    const links = screen.getAllByRole("link");
    const lessonLinks = links.filter(l => l.getAttribute("href")?.startsWith("/lesson/"));
    expect(lessonLinks).toHaveLength(2);
  });

  it("shows invalid URL message when params are missing", () => {
    vi.mocked(useParams).mockReturnValue({} as any);
    vi.mocked(useLessons).mockReturnValue({ data: undefined, isLoading: false, error: null } as any);
    render(<CategoryView />);
    expect(screen.getByText(/Invalid URL/i)).toBeInTheDocument();
  });
});
