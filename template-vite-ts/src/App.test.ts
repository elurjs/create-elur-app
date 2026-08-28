import { describe, it, expect } from "vitest";
import { render, screen } from "@elurjs/core-testing";
import { html } from "@elurjs/core";

function Hello() {
  return html`<div><h1>Hello Elur</h1></div>`;
}

describe("Hello", () => {
  it("renders a greeting", () => {
    render(Hello());
    expect(screen.getByText("Hello Elur")).toBeTruthy();
  });
});
