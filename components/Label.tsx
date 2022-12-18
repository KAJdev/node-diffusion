export function Label({ children }: { children?: React.ReactNode }) {
  return (
    <h2 className="text-sm text-white/60 font-medium relative">{children}</h2>
  );
}
