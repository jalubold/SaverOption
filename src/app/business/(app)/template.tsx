/** Each page in the app fades up into place on navigation (no motion with reduced-motion settings). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="so-page">{children}</div>;
}
