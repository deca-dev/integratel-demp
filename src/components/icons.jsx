export function ChevronDown() {
  return (
    <svg className="w-2.5 h-2.5" viewBox="0 0 10 7" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 1.04C0 .89.07.75.18.64.4.44.75.45.96.68L5.04 4.99l4-4.31C9.24.46 9.59.44 9.82.64c.22.2.24.54.05.76L5.45 6.16c-.1.11-.25.17-.41.17-.15 0-.3-.07-.41-.17L.15 1.41C.05 1.31 0 1.18 0 1.04Z" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export function SearchIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 7.9C0 12.31 3.58 15.89 7.99 15.89c1.93.01 3.79-.7 5.23-1.95l5.8 5.8c.11.11.25.17.4.17s.3-.06.4-.17c.22-.22.22-.59 0-.81l-5.8-5.81c2.6-3.1 2.48-7.73-.39-10.69-3.07-3.17-8.13-3.25-11.3-.18C.84 3.75 0 5.78 0 7.9Z" />
    </svg>
  );
}

export function BellIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 16 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.14 16.29c.54 0 .94-.14 1.2-.43.28-.3.36-.71.39-1.01H6.56c.02.3.11.71.38 1.01.27.29.66.43 1.2.43Zm7.31-1.46c.15 0 .28-.09.33-.23.05-.14.01-.3-.11-.39-1.84-1.47-1.68-4.52-1.67-4.57V6.35c0-1.85-.55-3.28-1.64-4.27-1.64-1.49-3.92-1.42-4.2-1.4-.28-.02-2.58-.11-4.21 1.4-1.07 1-1.64 2.4-1.64 4.26v3.31c0 .03.17 3.08-1.67 4.55-.12.09-.16.25-.11.39.05.14.19.23.34.23h4.77c.01.42.1 1.19.63 1.78.45.48 1.08.73 1.9.73s1.45-.25 1.9-.73c.53-.58.63-1.35.63-1.78l4.78.01Z" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.2 21.5h4v-8h3.6l.4-4h-4v-2c0-.5.5-1 1-1h3v-4h-3a5 5 0 00-5 5v2h-2l-.4 4h2.4v8z" />
    </svg>
  );
}

export function YouTubeIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.58 6.19a2.5 2.5 0 00-1.77-1.77C18.25 4 12 4 12 4s-6.25 0-7.81.42a2.5 2.5 0 00-1.77 1.77C2 7.75 2 12 2 12s0 4.25.42 5.81a2.5 2.5 0 001.77 1.77C5.75 20 12 20 12 20s6.25 0 7.81-.42a2.5 2.5 0 001.77-1.77C22 16.25 22 12 22 12s0-4.25-.42-5.81zM10 15.46V8.54L16 12l-6 3.46z" />
    </svg>
  );
}

export function TwitterIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
    </svg>
  );
}
