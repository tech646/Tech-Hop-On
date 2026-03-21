export function Footer() {
  return (
    <footer className="bg-white border-t border-[#e1e7ef] mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-3 gap-8">
          {/* Logo + description */}
          <div>
            <div className="flex items-center gap-1 mb-3">
              <div>
                <span className="text-[#FFCB22] font-extrabold text-lg leading-none block">HOP</span>
                <span className="text-[#1b2232] font-extrabold text-lg leading-none block">ON</span>
              </div>
              <div className="w-5 h-5 rounded-full bg-[#78B4E3] flex items-center justify-center ml-1">
                <span className="text-xs">🐸</span>
              </div>
            </div>
            <p className="text-sm text-[#65758b] leading-relaxed max-w-[280px]">
              Capacitando jovens talentos para conquistar as melhores oportunidades educacionais no mundo todo.
            </p>
          </div>

          {/* Suporte */}
          <div>
            <p className="text-xs font-bold text-[#1b2232] uppercase tracking-wider mb-4">Suporte</p>
            <ul className="space-y-2.5">
              <li><a href="/central-de-ajuda" className="text-sm text-[#65758b] hover:text-[#0057b8] transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-sm text-[#65758b] hover:text-[#0057b8] transition-colors">Termos de Uso</a></li>
              <li><a href="/quem-somos" className="text-sm text-[#65758b] hover:text-[#0057b8] transition-colors">Quem somos</a></li>
            </ul>
          </div>

          {/* Novidades */}
          <div>
            <p className="text-xs font-bold text-[#1b2232] uppercase tracking-wider mb-4">Novidades</p>
            <div className="flex items-center gap-2 bg-[#edf0f3] rounded-xl p-1 pl-3">
              <input
                type="email"
                placeholder="Seu e-mail"
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
