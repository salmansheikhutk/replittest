import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "@/pages/Home";

// Stub wouter's Link so we don't need a router context
vi.mock("wouter", () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Home page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    expect(screen.getByText(/Master Arabic/i)).toBeInTheDocument();
  });

  it("renders Sarf and Nahw sections", () => {
    render(<Home />);
    expect(screen.getAllByText(/Sarf/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Nahw/i).length).toBeGreaterThan(0);
  });

  it("renders all three difficulty levels", () => {
    render(<Home />);
    expect(screen.getAllByText(/Beginner/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Intermediate/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Advanced/i).length).toBeGreaterThan(0);
  });
});
