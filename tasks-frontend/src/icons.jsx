function IconBase({
  size = 16,
  strokeWidth = 2,
  children,
  className = "",
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function CheckCircle2(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  );
}

export function CircleDashed(props) {
  return (
    <IconBase {...props}>
      <path d="M8.5 3.5h2" />
      <path d="M13.5 3.5h2" />
      <path d="M18.5 5.5l1.4 1.4" />
      <path d="M20.5 10.5v2" />
      <path d="M19.9 17.1 18.5 18.5" />
      <path d="M15.5 20.5h-2" />
      <path d="M10.5 20.5h-2" />
      <path d="M5.5 18.5 4.1 17.1" />
      <path d="M3.5 13.5v-2" />
      <path d="M4.1 6.9 5.5 5.5" />
    </IconBase>
  );
}

export function ListTodo(props) {
  return (
    <IconBase {...props}>
      <path d="M9 6h11" />
      <path d="M9 12h11" />
      <path d="M9 18h11" />
      <path d="m3.5 6 .5.5 1-1" />
      <path d="m3.5 12 .5.5 1-1" />
      <path d="m3.5 18 .5.5 1-1" />
    </IconBase>
  );
}

export function Pencil(props) {
  return (
    <IconBase {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
    </IconBase>
  );
}

export function Trash2(props) {
  return (
    <IconBase {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </IconBase>
  );
}

export function Plus(props) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  );
}

export function Save(props) {
  return (
    <IconBase {...props}>
      <path d="M5 3h11l3 3v15H5z" />
      <path d="M9 3v6h6V3" />
      <path d="M9 21v-6h6v6" />
    </IconBase>
  );
}

export function X(props) {
  return (
    <IconBase {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconBase>
  );
}