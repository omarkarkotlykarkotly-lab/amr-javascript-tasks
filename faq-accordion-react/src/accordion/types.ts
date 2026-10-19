import type { ReactNode } from "react";

export type AccordionType = "single" | "multiple";
export type AccordionVariant = "filled" | "outlined" | "ghost" | "card";
export type AccordionLegacyVariant = "default" | "bordered";
export type AccordionSize = "sm" | "md" | "lg";
export type AccordionDirection = "ltr" | "rtl";
export type AccordionOrientation = "vertical" | "horizontal";
export type AccordionHeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";
export type AccordionIconPreset = "caret" | "chevron" | "plus" | "arrow";
export type AccordionValue = string | string[] | undefined;

export interface AccordionIconRenderProps {
  open: boolean;
  disabled: boolean;
  direction: AccordionDirection;
}

export type AccordionIcon =
  | AccordionIconPreset
  | ReactNode
  | ((state: AccordionIconRenderProps) => ReactNode);

export interface AccordionDataItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}
