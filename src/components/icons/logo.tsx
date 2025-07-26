export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 18.5V13.3333C4 13.3333 7.85714 14.5 9.71429 10C11.5714 5.5 13.4286 2.5 17.2857 5C21.1429 7.5 20.2143 14.5 20.2143 14.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.33317 19.4998L1.6665 17.9998V14.9998L4.33317 13.4998L6.99984 14.9998V17.9998L4.33317 19.4998Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
    </svg>
  );
}
