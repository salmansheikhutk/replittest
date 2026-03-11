import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProgress } from "@/hooks/use-progress";

describe("useProgress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty completedLessonIds and 0 xp", () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.progress.completedLessonIds).toEqual([]);
    expect(result.current.progress.xp).toBe(0);
  });

  it("markLessonComplete adds lessonId to completedLessonIds", () => {
    const { result } = renderHook(() => useProgress());
    act(() => {
      result.current.markLessonComplete(1);
    });
    expect(result.current.progress.completedLessonIds).toContain(1);
  });

  it("markLessonComplete awards 50 XP by default", () => {
    const { result } = renderHook(() => useProgress());
    act(() => {
      result.current.markLessonComplete(1);
    });
    expect(result.current.progress.xp).toBe(50);
  });

  it("markLessonComplete accepts a custom XP amount", () => {
    const { result } = renderHook(() => useProgress());
    act(() => {
      result.current.markLessonComplete(1, 100);
    });
    expect(result.current.progress.xp).toBe(100);
  });

  it("completing the same lesson twice does not duplicate the id", () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markLessonComplete(1); });
    act(() => { result.current.markLessonComplete(1); });
    const ids = result.current.progress.completedLessonIds.filter((id: number) => id === 1);
    expect(ids).toHaveLength(1);
  });

  it("completing the same lesson twice does not add XP twice", () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markLessonComplete(1); });
    act(() => { result.current.markLessonComplete(1); });
    expect(result.current.progress.xp).toBe(50);
  });

  it("can complete multiple different lessons", () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markLessonComplete(1); });
    act(() => { result.current.markLessonComplete(2); });
    act(() => { result.current.markLessonComplete(3); });
    expect(result.current.progress.completedLessonIds).toEqual([1, 2, 3]);
    expect(result.current.progress.xp).toBe(150);
  });

  it("isLessonComplete returns false for a lesson that has not been completed", () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.isLessonComplete(99)).toBe(false);
  });

  it("isLessonComplete returns true after completing a lesson", () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markLessonComplete(5); });
    expect(result.current.isLessonComplete(5)).toBe(true);
  });

  it("isLessonComplete returns false for a different lesson", () => {
    const { result } = renderHook(() => useProgress());
    act(() => { result.current.markLessonComplete(5); });
    expect(result.current.isLessonComplete(6)).toBe(false);
  });
});
