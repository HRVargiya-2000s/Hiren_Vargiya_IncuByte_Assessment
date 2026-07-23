import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Toast from "../../components/common/Toast";

describe("Toast", () => {
  it("renders a success notification", () => {
    render(<Toast message="Vehicle purchased" type="success" />);

    expect(screen.getByRole("status")).toHaveTextContent("Vehicle purchased");
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
