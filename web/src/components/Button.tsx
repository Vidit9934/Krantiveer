import { Link } from "react-router-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { Magnetic } from "../motion/Magnetic";

type Variant = "primary" | "secondary" | "quiet";

interface CommonProps {
  variant?: Variant;
  icon?: IconName;
  iconAfter?: IconName;
  children: ReactNode;
  className?: string;
  block?: boolean;
  /** Drifts toward the pointer. Use on scene calls to action, not in dense screens. */
  magnetic?: boolean;
  /** Label the custom cursor shows while hovering this control. */
  cursor?: string;
}

type ButtonProps = CommonProps &
  (
    | ({ to: string; href?: never } & Record<never, never>)
    | ({ href: string; to?: never; external?: boolean } & Record<never, never>)
    | ({ to?: never; href?: never } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
  );

export function Button(props: ButtonProps) {
  const { variant = "primary", icon, iconAfter, children, className = "", block, magnetic, cursor } = props;
  const cls = `btn btn--${variant}${block ? " btn--block" : ""} ${className}`.trim();
  const inner = (
    <>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {iconAfter && <Icon name={iconAfter} size={18} />}
    </>
  );
  const wrap = (node: ReactNode) => (magnetic ? <Magnetic>{node}</Magnetic> : node);

  if ("to" in props && props.to) {
    return wrap(
      <Link className={cls} to={props.to} data-cursor={cursor}>
        {inner}
      </Link>,
    );
  }
  if ("href" in props && props.href) {
    const external = "external" in props ? props.external : false;
    return wrap(
      <a className={cls} href={props.href} data-cursor={cursor} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {inner}
      </a>,
    );
  }

  const { variant: _v, icon: _i, iconAfter: _ia, children: _c, className: _cn, block: _b, magnetic: _m, cursor: _cu, to: _t, href: _h, ...buttonProps } =
    props as ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;
  void _v; void _i; void _ia; void _c; void _cn; void _b; void _m; void _cu; void _t; void _h;
  return wrap(
    <button className={cls} type="button" data-cursor={cursor} {...buttonProps}>
      {inner}
    </button>,
  );
}
