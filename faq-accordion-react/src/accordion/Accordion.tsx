import {
  Children,
  Fragment,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import type {
  AccordionDataItem,
  AccordionDirection,
  AccordionHeadingLevel,
  AccordionIcon,
  AccordionIconPreset,
  AccordionLegacyVariant,
  AccordionOrientation,
  AccordionSize,
  AccordionType,
  AccordionValue,
  AccordionVariant,
} from "./types";

export type {
  AccordionDataItem,
  AccordionDirection,
  AccordionHeadingLevel,
  AccordionIcon,
  AccordionIconPreset,
  AccordionIconRenderProps,
  AccordionLegacyVariant,
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
  variant?: AccordionVariant | AccordionLegacyVariant;
  size?: AccordionSize;
  icon?: AccordionIcon;
  iconPosition?: "start" | "end";
  headingLevel?: AccordionHeadingLevel;
  animated?: boolean;
  defaultOpenFirst?: boolean;
  /** @deprecated Use variant="outlined" instead. */
  bordered?: boolean;
  children: ReactNode;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

export interface AccordionHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: AccordionHeadingLevel;
  children: ReactNode;
}

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: AccordionIcon;
  iconPosition?: "start" | "end";
  asChild?: boolean;
  children: ReactNode;
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface AccordionProps extends Omit<AccordionRootProps, "type" | "children"> {
  type?: AccordionType;
  items: readonly AccordionDataItem[];
  itemClassName?: string;
  headerClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

interface RootContextValue {
  rootId: string;
  type: AccordionType;
  openValues: ReadonlySet<string>;
  disabled: boolean;
  collapsible: boolean;
  dir: AccordionDirection;
  orientation: AccordionOrientation;
  variant: AccordionVariant;
  size: AccordionSize;
  icon?: AccordionIcon;
  iconPosition: "start" | "end";
  headingLevel: AccordionHeadingLevel;
  animated: boolean;
  toggle: (value: string) => void;
}

interface ItemContextValue {
  value: string;
  triggerId: string;
  contentId: string;
  disabled: boolean;
  open: boolean;
}

type ButtonChildProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "data-accordion-trigger"?: string;
  "data-state"?: "open" | "closed";
};

const RootContext = createContext<RootContextValue | null>(null);
const ItemContext = createContext<ItemContextValue | null>(null);
const HeaderContext = createContext(false);

const ICON_PATHS: Record<AccordionIconPreset, string> = {
  caret: "M6 9l6 6 6-6Z",
  chevron: "M7 10l5 5 5-5",
  plus: "M12 5v14M5 12h14",
  arrow: "M5 12h14m-7-7 7 7-7 7",
};

function useRootContext(): RootContextValue {
  const context = useContext(RootContext);
  if (!context) throw new Error("Accordion parts must be rendered inside Accordion.Root.");
  return context;
}

function useItemContext(): ItemContextValue {
  const context = useContext(ItemContext);
  if (!context) throw new Error("Accordion parts must be rendered inside Accordion.Item.");
  return context;
}

function normalizeValue(type: AccordionType, value: AccordionValue): string[] {
  if (type === "multiple") return Array.isArray(value) ? value : value == null ? [] : [value];
  if (Array.isArray(value)) return value.length && value[0] !== undefined ? [value[0]] : [];
  return value == null ? [] : [value];
}

function firstItemValue(children: ReactNode): string | undefined {
  for (const child of Children.toArray(children)) {
    if (!isValidElement<{ value?: unknown; children?: ReactNode }>(child)) continue;
    if (typeof child.props.value === "string") return child.props.value;
    if (child.type === Fragment) {
      const nested = firstItemValue(child.props.children);
      if (nested) return nested;
    }
  }
  return undefined;
}

function resolveVariant(variant: AccordionVariant | AccordionLegacyVariant | undefined, bordered: boolean): AccordionVariant {
  if (variant === "default") return "filled";
  if (variant === "bordered") return "outlined";
  if (variant) return variant;
  return bordered ? "outlined" : "filled";
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): Ref<T> {
  return (value) => refs.forEach((ref) => assignRef(ref, value));
}

function isPresetIcon(value: AccordionIcon | undefined): value is AccordionIconPreset {
  return typeof value === "string" && ["caret", "chevron", "plus", "arrow"].includes(value);
}

function IconMark({ name, open }: { name: AccordionIconPreset; open: boolean }) {
  const actualName = name === "plus" && open ? "minus" : name;
  const path = actualName === "minus" ? "M5 12h14" : ICON_PATHS[actualName as AccordionIconPreset];
  return (
    <svg className="accordion-icon-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d={path} fill={actualName === "caret" ? "currentColor" : "none"} stroke={actualName === "caret" ? "none" : "currentColor"} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const Item = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, disabled = false, className, children, ...rest },
  forwardedRef,
) {
  const root = useRootContext();
  const itemId = useId();
  const context = useMemo<ItemContextValue>(() => ({
    value,
    triggerId: root.rootId + "-trigger-" + itemId.replace(/:/g, ""),
    contentId: root.rootId + "-content-" + itemId.replace(/:/g, ""),
    disabled: root.disabled || disabled,
    open: root.openValues.has(value),
  }), [value, itemId, root.rootId, root.disabled, disabled, root.openValues]);

  return (
    <ItemContext.Provider value={context}>
      <div
        {...rest}
        ref={forwardedRef}
        className={["accordion-item", className].filter(Boolean).join(" ")}
        data-state={context.open ? "open" : "closed"}
        data-disabled={context.disabled ? "true" : undefined}
        data-animated={root.animated ? "true" : "false"}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
});
Item.displayName = "Accordion.Item";

const Root = forwardRef<HTMLDivElement, AccordionRootProps>(function AccordionRoot(
  props,
  forwardedRef,
) {
  const {
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible = false,
    disabled = false,
    dir = "ltr",
    orientation = "vertical",
    variant,
    size = "md",
    icon,
    iconPosition = "end",
    headingLevel = "h3",
    animated = true,
    defaultOpenFirst = false,
    bordered = false,
    className,
    children,
    id,
    ...rest
  } = props;
  const generatedId = useId();
  const rootId = "accordion-" + generatedId.replace(/:/g, "");
  const controlled = Object.prototype.hasOwnProperty.call(props, "value");
  const initialValue = defaultValue ?? (defaultOpenFirst ? firstItemValue(children) : undefined);
  const [internalValue, setInternalValue] = useState<string[]>(() => normalizeValue(type, initialValue));
  const selected = normalizeValue(type, controlled ? value : internalValue);
  const selectedKey = JSON.stringify(selected);
  const openValues = useMemo(() => new Set(JSON.parse(selectedKey) as string[]), [selectedKey]);
  const normalizedVariant = resolveVariant(variant, bordered);

  const toggle = useCallback((itemValue: string) => {
    const current = normalizeValue(type, controlled ? value : internalValue);
    let next: string[];
    if (type === "single") {
      if (current.includes(itemValue)) {
        if (!collapsible) return;
        next = [];
      } else {
        next = [itemValue];
      }
    } else {
      next = current.includes(itemValue)
        ? current.filter((entry) => entry !== itemValue)
        : [...current, itemValue];
    }
    if (!controlled) setInternalValue(next);
    onValueChange?.(type === "single" ? next[0] : next);
  }, [type, controlled, value, internalValue, collapsible, onValueChange]);

  const context = useMemo<RootContextValue>(() => ({
    rootId,
    type,
    openValues,
    disabled,
    collapsible,
    dir,
    orientation,
    variant: normalizedVariant,
    size,
    icon,
    iconPosition,
    headingLevel,
    animated,
    toggle,
  }), [rootId, type, openValues, disabled, collapsible, dir, orientation, normalizedVariant, size, icon, iconPosition, headingLevel, animated, toggle]);

  return (
    <RootContext.Provider value={context}>
      <div
        {...rest}
        ref={forwardedRef}
        id={id ?? rootId}
        data-accordion-root=""
        data-type={type}
        data-variant={normalizedVariant}
        data-size={size}
        data-orientation={orientation}
        data-animated={animated ? "true" : "false"}
        data-bordered={bordered ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        dir={dir}
        className={["accordion", className].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    </RootContext.Provider>
  );
});
Root.displayName = "Accordion.Root";

const Header = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(function AccordionHeader(
  { level, className, children, ...rest },
  forwardedRef,
) {
  const root = useRootContext();
  const Heading = level ?? root.headingLevel;
  return (
    <HeaderContext.Provider value={true}>
      <Heading
        {...rest}
        ref={forwardedRef}
        className={["accordion-heading", className].filter(Boolean).join(" ")}
      >
        {children}
      </Heading>
    </HeaderContext.Provider>
  );
});
Header.displayName = "Accordion.Header";

const Trigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(function AccordionTrigger(
  { icon, iconPosition, asChild = false, className, children, onKeyDown, onClick, type = "button", disabled, ...rest },
  forwardedRef,
) {
  const root = useRootContext();
  const item = useItemContext();
  const insideHeader = useContext(HeaderContext);

  const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const rootElement = event.currentTarget.closest<HTMLElement>("[data-accordion-root]");
    const triggers = Array.from(
      rootElement?.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger="true"]:not(:disabled)') ?? [],
    ).filter((trigger) => trigger.closest("[data-accordion-root]") === rootElement);
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

  const resolvedIcon = icon ?? root.icon ?? "caret";
  const position = iconPosition ?? root.iconPosition;
  const iconContent = typeof resolvedIcon === "function"
    ? resolvedIcon({ open: item.open, disabled: item.disabled, direction: root.dir })
    : isPresetIcon(resolvedIcon)
      ? <IconMark name={resolvedIcon} open={item.open} />
      : resolvedIcon;

  const triggerContent = (
    <>
      {position === "start" ? (
        <span className="accordion-trigger-icon accordion-trigger-icon-start" data-icon-position="start" data-state={item.open ? "open" : "closed"} aria-hidden="true">
          {iconContent}
        </span>
      ) : null}
      <span className="accordion-trigger-label">{asChild && isValidElement<ButtonChildProps>(children) ? children.props.children : children}</span>
      {position === "end" ? (
        <span className="accordion-trigger-icon accordion-trigger-icon-end" data-icon-position="end" data-icon-shape={isPresetIcon(resolvedIcon) ? resolvedIcon : "custom"} data-state={item.open ? "open" : "closed"} aria-hidden="true">
          {iconContent}
        </span>
      ) : null}
    </>
  );

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (!event.defaultPrevented && !item.disabled && !disabled) root.toggle(item.value);
  };

  let buttonElement: ReactNode;
  if (asChild) {
    if (!isValidElement<ButtonChildProps>(children)) {
      throw new Error("Accordion.Trigger with asChild requires a single button-compatible element child.");
    }
    const child = children as ReactElement<ButtonChildProps>;
    const childProps = child.props;
    buttonElement = cloneElement(child, {
      ...rest,
      ref: mergeRefs(forwardedRef, childProps.ref),
      id: item.triggerId,
      type,
      className: [childProps.className, "accordion-trigger", className].filter(Boolean).join(" "),
      disabled: item.disabled || disabled || childProps.disabled,
      "aria-expanded": item.open,
      "aria-controls": item.contentId,
      "data-accordion-trigger": "true",
      "data-state": item.open ? "open" : "closed",
      onKeyDown: (event) => {
        childProps.onKeyDown?.(event);
        handleKeyDown(event);
      },
      onClick: (event) => {
        childProps.onClick?.(event);
        handleClick(event);
      },
      children: triggerContent,
    });
  } else {
    buttonElement = (
      <button
        {...rest}
        ref={forwardedRef}
        id={item.triggerId}
        type={type}
        className={["accordion-trigger", className].filter(Boolean).join(" ")}
        disabled={item.disabled || disabled}
        aria-expanded={item.open}
        aria-controls={item.contentId}
        data-accordion-trigger="true"
        data-state={item.open ? "open" : "closed"}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      >
        {triggerContent}
      </button>
    );
  }

  return insideHeader ? buttonElement : <Header>{buttonElement}</Header>;
});
Trigger.displayName = "Accordion.Trigger";

const Content = forwardRef<HTMLDivElement, AccordionContentProps>(function AccordionContent(
  { className, children, ...rest },
  forwardedRef,
) {
  const item = useItemContext();
  const root = useRootContext();
  return (
    <div
      {...rest}
      ref={forwardedRef}
      id={item.contentId}
      className={["accordion-content", className].filter(Boolean).join(" ")}
      role="region"
      aria-labelledby={item.triggerId}
      aria-hidden={!item.open}
      data-state={item.open ? "open" : "closed"}
      data-animated={root.animated ? "true" : "false"}
      inert={!item.open}
    >
      <div className="accordion-content-inner">{children}</div>
    </div>
  );
});
Content.displayName = "Accordion.Content";

const AccordionBase = forwardRef<HTMLDivElement, AccordionProps>(function AccordionConvenience(
  {
    items,
    type = "single",
    itemClassName,
    headerClassName,
    triggerClassName,
    contentClassName,
    ...rootProps
  },
  forwardedRef,
) {
  return (
    <Root {...rootProps} ref={forwardedRef} type={type}>
      {items.map((item) => (
        <Item key={item.value} value={item.value} disabled={item.disabled} className={itemClassName}>
          <Header className={headerClassName}>
            <Trigger className={triggerClassName}>{item.title}</Trigger>
          </Header>
          <Content className={contentClassName}>{item.content}</Content>
        </Item>
      ))}
    </Root>
  );
});
AccordionBase.displayName = "Accordion";

export const Accordion = Object.assign(AccordionBase, {
  Root,
  Item,
  Header,
  Trigger,
  Content,
});
export { Root, Item, Header, Trigger, Content };
