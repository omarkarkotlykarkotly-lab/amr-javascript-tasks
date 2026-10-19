export type AccordionType = "single" | "multiple";
export type AccordionVariant = "default" | "bordered" | "filled" | "ghost";
export type AccordionSize = "sm" | "md" | "lg";
export type AccordionDirection = "ltr" | "rtl";
export type AccordionOrientation = "vertical" | "horizontal";
export type AccordionValue = string | string[] | undefined;
export interface AccordionIconRenderProps { open: boolean; disabled: boolean; direction: AccordionDirection; }
export type AccordionIcon = import("react").ReactNode | ((state: AccordionIconRenderProps) => import("react").ReactNode);
