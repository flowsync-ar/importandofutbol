import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { StoreProvider, useStore } from "@/components/store-provider";

function Harness() {
  const { cart, addToCart, changeQuantity, removeFromCart } = useStore();
  return <>
    <button onClick={() => addToCart({ id: "1", name: "Argentina", size: "M" })}>add-m</button>
    <button onClick={() => addToCart({ id: "1", name: "Argentina", size: "L", quantity: 2 })}>add-l</button>
    <button onClick={() => changeQuantity("1", "M", 1)}>plus-m</button>
    <button onClick={() => changeQuantity("1", "L", -1)}>minus-l</button>
    <button onClick={() => removeFromCart("1", "M")}>remove-m</button>
    <output>{cart.map((item) => `${item.size}:${item.quantity ?? 1}`).join(",") || "empty"}</output>
    <data>{cart.reduce((total, item) => total + (item.quantity ?? 1), 0)}</data>
  </>;
}

describe("StoreProvider", () => {
  beforeEach(() => localStorage.clear());

  it("stores cart items", () => {
    render(<StoreProvider><Harness /></StoreProvider>);
    fireEvent.click(screen.getByText("add-m"));
    expect(screen.getByText("1")).toBeVisible();
    expect(localStorage.getItem("iflp-cart")).toContain("Argentina");
  });

  it("keeps different sizes of the same jersey and counts quantity", () => {
    render(<StoreProvider><Harness /></StoreProvider>);
    fireEvent.click(screen.getByText("add-m"));
    fireEvent.click(screen.getByText("add-m"));
    fireEvent.click(screen.getByText("add-l"));
    expect(screen.getByText("M:2,L:2")).toBeVisible();
    expect(screen.getByText("4")).toBeVisible();
  });

  it("changes quantity and removes a size line", () => {
    render(<StoreProvider><Harness /></StoreProvider>);
    fireEvent.click(screen.getByText("add-m"));
    fireEvent.click(screen.getByText("add-l"));
    fireEvent.click(screen.getByText("plus-m"));
    fireEvent.click(screen.getByText("minus-l"));
    expect(screen.getByText("M:2,L:1")).toBeVisible();
    fireEvent.click(screen.getByText("remove-m"));
    expect(screen.getByText("L:1")).toBeVisible();
  });
});
