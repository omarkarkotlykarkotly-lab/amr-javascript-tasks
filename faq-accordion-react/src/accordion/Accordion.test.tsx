import React, { useState } from "react";
import { axe } from "jest-axe";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Accordion } from "./index";

function Example({ type = "single", ...props }: Partial<React.ComponentProps<typeof Accordion.Root>> & { type?: "single" | "multiple" }) {
  return (
    <Accordion.Root type={type} {...props}>
      <Accordion.Item value="one">
        <Accordion.Trigger>First question</Accordion.Trigger>
        <Accordion.Content><p>First answer.</p></Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Trigger>Second question</Accordion.Trigger>
        <Accordion.Content><p>Second answer.</p></Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="three">
        <Accordion.Trigger>Third question</Accordion.Trigger>
        <Accordion.Content><p>Third answer.</p></Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

describe("Accordion", () => {
  it("toggles items in uncontrolled single mode", () => {
    render(<Example type="single" defaultValue="one" collapsible />);
    expect(screen.getByRole("button", { name: /first question/i })).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: /second question/i }));
    expect(screen.getByRole("button", { name: /first question/i })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: /second question/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("allows multiple open items in multiple mode", () => {
    render(<Example type="multiple" defaultValue={["one"]} />);
    fireEvent.click(screen.getByRole("button", { name: /second question/i }));
    expect(screen.getByRole("button", { name: /first question/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /second question/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("supports controlled values and notifies the parent", () => {
    function Controlled() {
      const [value, setValue] = useState("one");
      return (
        <>
          <output>{value}</output>
          <Example type="single" value={value} onValueChange={(next) => setValue(String(next))} collapsible />
        </>
      );
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole("button", { name: /second question/i }));
    expect(screen.getByText("two")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /second question/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("does not close the active single item when collapsible is false", () => {
    render(<Example type="single" defaultValue="one" />);
    fireEvent.click(screen.getByRole("button", { name: /first question/i }));
    expect(screen.getByRole("button", { name: /first question/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("supports root-level and item-level disabled states", () => {
    const { rerender } = render(<Example type="multiple" disabled />);
    expect(screen.getByRole("button", { name: /first question/i })).toBeDisabled();
    rerender(
      <Accordion.Root type="multiple">
        <Accordion.Item value="one" disabled>
          <Accordion.Trigger>Disabled item</Accordion.Trigger>
          <Accordion.Content>Not available.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="two">
          <Accordion.Trigger>Enabled item</Accordion.Trigger>
          <Accordion.Content>Available.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    expect(screen.getByRole("button", { name: /disabled item/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /enabled item/i })).toBeEnabled();
  });

  it("moves focus with arrow keys, Home, and End", () => {
    render(<Example type="multiple" />);
    const first = screen.getByRole("button", { name: /first question/i });
    const second = screen.getByRole("button", { name: /second question/i });
    const third = screen.getByRole("button", { name: /third question/i });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(second).toHaveFocus();
    fireEvent.keyDown(second, { key: "End" });
    expect(third).toHaveFocus();
    fireEvent.keyDown(third, { key: "Home" });
    expect(first).toHaveFocus();
  });

  it("reverses horizontal arrow navigation for RTL", () => {
    render(<Example type="multiple" dir="rtl" orientation="horizontal" />);
    const first = screen.getByRole("button", { name: /first question/i });
    const second = screen.getByRole("button", { name: /second question/i });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowLeft" });
    expect(second).toHaveFocus();
  });

  it("renders an accessible labelled region", async () => {
    const { container } = render(<Example type="single" defaultValue="one" />);
    const report = await axe(container);
    expect(report.violations).toHaveLength(0);
    expect(screen.getByRole("region", { name: /first question/i })).toBeInTheDocument();
  });

  it("accepts a custom icon render slot", () => {
    render(
      <Accordion.Root type="single" defaultValue="one">
        <Accordion.Item value="one">
          <Accordion.Trigger icon={({ open }) => <span>{open ? "−" : "+"}</span>}>Custom icon</Accordion.Trigger>
          <Accordion.Content>Custom answer.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    expect(screen.getByText("−")).toBeInTheDocument();
  });

  it("supports the Header part and configurable heading levels", () => {
    render(
      <Accordion.Root type="single" headingLevel="h4" defaultValue="intro">
        <Accordion.Item value="intro">
          <Accordion.Header>
            <Accordion.Trigger>Accessible heading trigger</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Answer panel.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    expect(screen.getByRole("heading", { level: 4, name: /accessible heading trigger/i })).toBeInTheDocument();
  });

  it("renders from data with the convenience Accordion component", () => {
    render(
      <Accordion
        type="single"
        variant="card"
        size="lg"
        defaultOpenFirst
        items={[
          { value: "one", title: "First data question", content: "First data answer." },
          { value: "two", title: "Second data question", content: "Second data answer." },
        ]}
      />
    );
    expect(document.querySelector('[data-variant="card"]')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /first data question/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /second data question/i })).toHaveAttribute("aria-expanded", "false");
  });

  it("supports asChild without losing accordion semantics", () => {
    render(
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="slotted">
          <Accordion.Header>
            <Accordion.Trigger asChild>
              <button className="custom-trigger">Slotted trigger</button>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Slotted answer.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    const trigger = screen.getByRole("button", { name: /slotted trigger/i });
    expect(trigger).toHaveClass("custom-trigger");
    expect(trigger).toHaveAttribute("aria-controls");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("supports custom icons at the start of a trigger", () => {
    render(
      <Accordion.Root type="single" iconPosition="start" icon={({ open }) => <span>{open ? "Open" : "Closed"}</span>}>
        <Accordion.Item value="icon">
          <Accordion.Trigger>Icon position</Accordion.Trigger>
          <Accordion.Content>Custom icon answer.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
    expect(screen.getByText("Closed")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /icon position/i }));
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

});
