export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  /** show header in mobile navigation using current href, below accordian trigger (self) */
  hasHomeItem?: boolean;
  /** show "more" item in mobile navigation using current href, below accordian items */
  hasMoreItem?: boolean;
}

export interface ButtonItem {
  /** unique name for id and class */
  name: string;
  /** href */
  href?: string;
  /** string content, HTML or text */
  label?: string;
  /** icon name (svg in /icons/) */
  icon?: string;
  /** visibility min breakpoint */
  vbp?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}