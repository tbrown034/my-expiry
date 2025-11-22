export default function Footer() {
  return (
    <footer className="bg-slate-700/40 backdrop-blur-sm border-t border-slate-600/30">
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center text-xs text-slate-400/80">
          <span>© 2025 My Expiry</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">About</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
