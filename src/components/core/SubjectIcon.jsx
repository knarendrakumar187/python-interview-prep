export function SubjectIcon({ id, className = "w-5 h-5" }) {
  const paths = {
    oops: <path d="M7 8h10M7 12h6M7 16h8M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />,
    dbms: (
      <>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </>
    ),
    os: (
      <>
        <rect x="4" y="5" width="16" height="12" rx="1" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
    cn: (
      <>
        <circle cx="6" cy="8" r="2" />
        <circle cx="18" cy="8" r="2" />
        <circle cx="12" cy="16" r="2" />
        <path d="M8 9l3 5M16 9l-3 5M8 8h8" />
      </>
    ),
  };
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      {paths[id] || paths.oops}
    </svg>
  );
}
