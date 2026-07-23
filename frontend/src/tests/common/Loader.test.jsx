import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Loader from "../../components/common/Loader";

describe("Loader", () => {
  it("renders loading skeleton rows", () => {
    render(<Loader rows={3} />);

    expect(screen.getByText(/loading inventory/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton-row")).toHaveLength(3);
  });
});
