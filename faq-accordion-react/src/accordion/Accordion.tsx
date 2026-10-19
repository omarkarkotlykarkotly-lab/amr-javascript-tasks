import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type ReactNode,
} from "react";
import type {
  AccordionDirection,
  AccordionIcon,
  AccordionOrientation,
  AccordionType,
  AccordionValue,
  AccordionVariant,
  AccordionSize,
} from "./types";
export type {
  AccordionDirection,
  AccordionIcon,
  AccordionIconRenderProps,
  AccordionOrientation,
  AccordionSize,
  AccordionType,
  AccordionValue,
  AccordionVariant,
} from "./types";

export interface AccordionRootProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  type: AccordionType;
  value?: AccordionValue;
  defaultValue?: AccordionValue;
  onValueChange?: (value: string | string[] | undefined) => void;
  collapsible?: boolean;
  disabled?: boolean;
  dir?: AccordionDirection;
  orientation?: AccordionOrientation;
  variant?: AccordionVariant;
  size?: AccordionSize;
  children: ReactNode;
}
export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> { value: string; disabled?: boolean; children: ReactNode; }
export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> { icon?: AccordionIcon; children: ReactNode; }
export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode; }

interface RootContextValue {
  rootId: string; type: AccordionType; openValues: ReadonlySet<string>; disabled: boolean;
  collapsible: boolean; dir: AccordionDirection; orientation: AccordionOrientation;
  variant: AccordionVariant; size: AccordionSize; toggle: (value: string) => void;
}
interface ItemContextValue { value: string; itemId: string; triggerId: string; contentId: string; disabled: boolean; open: boolean; }
const RootContext = createContext<RootContextValue | null>(null);
const ItemContext = createContext<ItemContextValue | null>(null);

function useRootContext() {
  const context = useContext(RootContext);
  if (!context) throw new Error("Accordion parts must be rendered inside Accordion.Root.");
  return context;
}
function useItemContext() {
  const context = useContext(ItemContext);
  if (!context) throw new Error("Accordion.Trigger and Accordion.Content must be rendered inside Accordion.Item.");
  return context;
}
function normalizeValue(type: AccordionType, value: AccordionValue): string[] {
  if (type === "multiple") return Array.isArray(value) ? value : value == null ? [] : [value];
  if (Array.isArray(value)) return value.length ? [value[0]] : [];
  return value == null ? [] : [value];
}

const Root = forwardRef<HTMLDivElement, AccordionRootProps>(function AccordionRoot(
  props, forwardedRef,
) {
  const { type, value, defaultValue, onValueChange, collapsible = false, disabled = false,
    dir = "ltr", orientation = "vertical", variant = "default", size = "md",
    className, children, id, ...rest } = props;
  const generatedId = useId();
  const rootId = "accordion-" + generatedId.replace(/:/g, "");
  const controlled = Object.prototype.hasOwnProperty.call(props, "value");
  const [internalValue, setInternalValue] = useState<string[]>(() => normalizeValue(type, defaultValue));
  const selected = normalizeValue(type, controlled ? value : internalValue);
  const selectedKey = JSON.stringify(selected);
  const openValues = useMemo(() => new Set(selected), [selectedKey]);

  const toggle = useCallback((itemValue: string) => {
    const current = normalizeValue(type, controlled ? value : internalValue);
    let next: string[];
    if (type === "single") {
      if (current.includes(itemValue)) next = collapsible ? [] : current;
      else next = [itemValue];
    } else {
      next = current.includes(itemValue) ? current.filter((entry) => entry !== itemValue) : [...current, itemValue];
    }
    if (!controlled) setInternalValue(next);
    onValueChange?.(type === "single" ? next[0] : next);
  }, [type, controlled, value, internalValue, collapsible, onValueChange]);

  const context = useMemo<RootContextValue>(() => ({
    rootId, type, openValues, disabled, collapsible, dir, orientation, variant, size, toggle,
  }), [rootId, type, openValues, disabled, collapsible, dir, orientation, variant, size, toggle]);

  return (
    <RootContext.Provider value={context}>
      <div {...rest} ref={forwardedRef} id={id ?? rootId} data-accordion-root=""
        data-type={type} data-variant={variant} data-size={size} data-orientation={orientation}
        dir={dir} className={["accordion", className].filter(Boolean).join(" ")}
        data-disabled={disabled ? "true" : undefined}>
        {children}
      </div>
    </RootContext.Provider>
  );
});
Root.displayName = "Accordion.Root";

const Item = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, disabled = false, className, children, ...rest }, forwardedRef,
) {
  const root = useRootContext();
  const itemReactId = useId();
  const safeValue = value.replace(/[^a-zA-Z0-9_-]/g, "-");
  const itemId = root.rootId + "-item-" + safeValue + "-" + itemReactId.replace(/:/g, "");
  const context = useMemo<ItemContextValue>(() => ({
    value, itemId, triggerId: itemId + "-trigger", contentId: itemId + "-content",
    disabled: root.disabled || disabled, open: root.openValues.has(value),
  }), [value, itemId, root.disabled, disabled, root.openValues]);
  return (
    <ItemContext.Provider value={context}>
      <div {...rest} ref={forwardedRef} className={["accordion-item", className].filter(Boolean).join(" ")}
        data-state={context.open ? "open" : "closed"} data-disabled={context.disabled ? "true" : undefined}>
        {children}
      </div>
    </ItemContext.Provider>
  );
});
Item.displayName = "Accordion.Item";

const Trigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(function AccordionTrigger(
  { icon, className, children, onKeyDown, onClick, type = "button", disabled, ...rest }, forwardedRef,
) {
  const root = useRootContext();
  const item = useItemContext();
  const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const rootElement = event.currentTarget.closest<HTMLElement>("[data-accordion-root]");
    const triggers = Array.from(rootElement?.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger="true"]:not(:disabled)') ?? []).filter((trigger) => trigger.closest("[data-accordion-root]") === rootElement);
    if (!triggers.length) return;
    const currentIndex = triggers.indexOf(event.currentTarget);
    let nextIndex = currentIndex;
    if (root.orientation === "vertical") {
      if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % triggers.length;
      else if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    } else {
      const forwardKey = root.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
      const backwardKey = root.dir === "rtl" ? "ArrowRight" : "ArrowLeft";
      if (event.key === forwardKey) nextIndex = (currentIndex + 1) % triggers.length;
      else if (event.key === backwardKey) nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = triggers.length - 1;
    if (nextIndex !== currentIndex) {
      event.preventDefault();
      triggers[nextIndex]?.focus();
    }
  };
  const iconContent = typeof icon === "function"
    ? icon({ open: item.open, disabled: item.disabled, direction: root.dir })
    : icon;
  return (
    <h3 className="accordion-heading">
      <button {...rest} ref={forwardedRef} id={item.triggerId} type={type}
        className={["accordion-trigger", className].filter(Boolean).join(" ")}
        disabled={item.disabled || disabled} aria-expanded={item.open} aria-controls={item.contentId}
        data-accordion-trigger="true" data-state={item.open ? "open" : "closed"}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && !item.disabled && !disabled) root.toggle(item.value);
        }}>
        <span className="accordion-trigger-label">{children}</span>
        <span className="accordion-trigger-icon" data-custom-icon={icon !== undefined ? "true" : undefined} aria-hidden="true">
          {iconContent ?? <span className="accordion-default-icon" data-icon-style="chevron" />}
        </span>
      </button>
    </h3>
  );
});
Trigger.displayName = "Accordion.Trigger";

const Content = forwardRef<HTMLDivElement, AccordionContentProps>(function AccordionContent(
  { className, children, ...rest }, forwardedRef,
) {
  const item = useItemContext();
  return (
    <div {...rest} ref={forwardedRef} id={item.contentId}
      className={["accordion-content", className].filter(Boolean).join(" ")}
      role="region" aria-labelledby={item.triggerId} aria-hidden={!item.open}
      data-state={item.open ? "open" : "closed"} inert={!item.open}>
      <div className="accordion-content-inner">{children}</div>
    </div>
  );
});
Content.displayName = "Accordion.Content";

export const Accordion = { Root, Item, Trigger, Content } as const;
export { Root, Item, Trigger, Content };
