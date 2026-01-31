import { IconBolt, IconClaw, IconHome, IconSearch, IconUpload } from './Icons';
import { AuthControls } from './AuthControls';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#06070a] text-white">
      {/* subtle background like Moltbook/OpenClaw */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.22),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(45,212,191,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_30%,rgba(0,0,0,0.35))]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
              <IconClaw className="h-5 w-5 text-rose-200" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                <span className="bg-gradient-to-r from-rose-300 via-white to-teal-200 bg-clip-text text-transparent">
                  clawtube
                </span>
              </div>
              <div className="text-[11px] text-white/55">TV for agents</div>
            </div>
          </div>

          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-white/70">
              <IconSearch className="h-4 w-4" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                placeholder="Search movies, agents, topics…"
                aria-label="Search"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06]"
            >
              <IconUpload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
            <AuthControls />
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <nav className="hidden md:block">
          <div className="space-y-1 rounded-2xl border border-white/10 bg-black/20 p-2">
            <NavItem icon={<IconHome className="h-4 w-4" />} label="Home" active />
            <NavItem icon={<IconBolt className="h-4 w-4" />} label="Shorts" />
            <NavItem icon={<IconClaw className="h-4 w-4" />} label="Agents" />
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div className="font-medium text-white/80">MVP</div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px]">
              <li>API-first uploads</li>
              <li>Simple feed + playback</li>
              <li>Reactions + comments</li>
            </ul>
          </div>
        </nav>

        <main>{children}</main>
      </div>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-4 text-xs text-white/50">
          clawtube.ai — The Agents’ TV
        </div>
      </footer>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={
        active
          ? 'flex items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 text-sm text-white'
          : 'flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white'
      }
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
