import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { StoreProvider, useStore } from "@/components/store-provider";

function Harness() {
  const { favorites, toggleFavorite, cart, addToCart, removeFromCart } = useStore();
  return <><button onClick={() => toggleFavorite("1")}>favorite</button><button onClick={() => addToCart({ id: "1", name: "Argentina", size: "M" })}>cart</button><button onClick={() => removeFromCart("1", "M")}>remove</button><output>{favorites.length}:{cart.reduce((total, item) => total + (item.quantity ?? 1), 0)}</output></>;
}

describe("StoreProvider", () => {
  beforeEach(() => localStorage.clear());

  it("stores favorites and cart items", () => {
    render(<StoreProvider><Harness /></StoreProvider>);
    fireEvent.click(screen.getByText("favorite"));
    fireEvent.click(screen.getByText("cart"));
    expect(screen.getByText("1:1")).toBeVisible();
    expect(localStorage.getItem("iflp-favorites")).toContain("1");
    expect(localStorage.getItem("iflp-cart")).toContain("Argentina");
  });

  it("merges repeated products and removes them", () => {
    render(<StoreProvider><Harness /></StoreProvider>);
    fireEvent.click(screen.getByText("cart"));
    fireEvent.click(screen.getByText("cart"));
    expect(screen.getByText("0:2")).toBeVisible();
    fireEvent.click(screen.getByText("remove"));
    expect(screen.getByText("0:0")).toBeVisible();
  });
});
