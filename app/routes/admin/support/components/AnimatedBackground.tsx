export function AnimatedBackground() {
  return (
    <>
      {/* Background avec gradient animé */}
      <div className="absolute inset-0 bg-linear-to-br from-babana-cyan/10 via-transparent to-babana-navy/10 dark:from-babana-cyan/5 dark:via-transparent dark:to-babana-navy/5" />
      
      {/* Effets de particules animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-babana-cyan/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-babana-navy/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-babana-cyan/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
    </>
  );
}

