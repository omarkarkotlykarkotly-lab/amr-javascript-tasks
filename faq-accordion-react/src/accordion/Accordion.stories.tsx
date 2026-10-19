import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Accordion } from "./index";
import "./accordion.css";

const meta: Meta = {
  title: "Components/Accordion",
  parameters: {
    layout: "centered",
    docs: { description: { component: "An accessible compound accordion with single and multiple selection modes, variants, and RTL navigation." } },
  },
};
export default meta;
type Story = StoryObj;

export const SingleCollapsible: Story = {
  render: () => (
    <div style={{ width: 520, maxWidth: "90vw" }}>
      <Accordion.Root type="single" defaultValue="profile" collapsible>
        <Accordion.Item value="profile">
          <Accordion.Trigger>Profile settings</Accordion.Trigger>
          <Accordion.Content><p>Manage your public profile and personal preferences.</p></Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="security">
          <Accordion.Trigger>Security and privacy</Accordion.Trigger>
          <Accordion.Content><p>Review sign-in options and privacy controls.</p></Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="notifications">
          <Accordion.Trigger>Notifications</Accordion.Trigger>
          <Accordion.Content><p>Choose which product updates you would like to receive.</p></Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

export const MultipleFilledLarge: Story = {
  render: () => (
    <div style={{ width: 520, maxWidth: "90vw" }}>
      <Accordion.Root type="multiple" defaultValue={["profile", "notifications"]} variant="filled" size="lg">
        <Accordion.Item value="profile">
          <Accordion.Trigger>Profile settings</Accordion.Trigger>
          <Accordion.Content><p>Manage your profile.</p></Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="notifications">
          <Accordion.Trigger>Notifications</Accordion.Trigger>
          <Accordion.Content><p>Control the notifications you receive.</p></Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <div style={{ width: 520, maxWidth: "90vw" }}>
      <Accordion.Root type="multiple">
        <Accordion.Item value="available">
          <Accordion.Trigger>Available section</Accordion.Trigger>
          <Accordion.Content>This item can be expanded.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="disabled" disabled>
          <Accordion.Trigger>Disabled section</Accordion.Trigger>
          <Accordion.Content>This content cannot be expanded by the user.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};

export const RightToLeft: Story = {
  render: () => (
    <div style={{ width: 520, maxWidth: "90vw" }}>
      <Accordion.Root type="multiple" dir="rtl" orientation="horizontal">
        <Accordion.Item value="overview">
          <Accordion.Trigger>Overview</Accordion.Trigger>
          <Accordion.Content>Right-to-left direction with mirrored horizontal keyboard navigation.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="details">
          <Accordion.Trigger>Details</Accordion.Trigger>
          <Accordion.Content>RTL layout and navigation direction are configured at the root.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};
