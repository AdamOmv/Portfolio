export default function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="blob-shape blob-green animate-blob-float-1 absolute -left-44 -top-36 h-[34rem] w-[34rem] rounded-full blur-[120px]" />
      <div className="blob-shape blob-blue animate-blob-float-2 absolute -right-24 top-[14%] h-[31rem] w-[31rem] rounded-full blur-[120px]" />
      <div className="blob-shape blob-yellow animate-blob-float-3 absolute bottom-[-13rem] left-[24%] h-[28rem] w-[28rem] rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_68%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0.02),transparent_32%,rgba(10,10,10,0.05))] opacity-0 dark:opacity-100" />
    </div>
  );
}
