import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#e1e7ef] mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-3 gap-8">
          {/* Logo + description */}
          <div>
            <div className="mb-3">
              <Image src="/images/logo.svg" alt="Hop On" width={70} height={38} />
            </div>
            <p className="text-sm text-[#65758b] leading-relaxed max-w-[280px]">
              Empowering young talents to seize the best educational opportunities around the world.
            </p>
          </div>

          {/* Suporte */}
          <div>
            <p className="text-xs font-bold text-[#1b2232] uppercase tracking-wider mb-4">Support</p>
            <ul className="space-y-2.5">
              <li><a href="/central-de-ajuda" className="text-sm text-[#65758b] hover:text-[#0057b8] transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-[#65758b] hover:text-[#0057b8] transition-colors">Terms of Use</a></li>
              <li><a href="/quem-somos" className="text-sm text-[#65758b] hover:text-[#0057b8] transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Novidades */}
          <div>
            <p className="text-xs font-bold text-[#1b2232] uppercase tracking-wider mb-4">Updates</p>
            <div className="flex items-center gap-2 bg-[#edf0f3] rounded-xl p-1 pl-3">
              <input
                type="email"
                placeholder="Your email"
                className="bg-transparent text-sm text-[#65758b] outline-none flex-1 placeholder:text-[#65758b]"
              />
              <button className="w-8 h-8 bg-[#0057b8] rounded-xl flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-[#65758b] mt-4">© 2024 HOPON EDUCATION. MADE FOR GLOBALS.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
