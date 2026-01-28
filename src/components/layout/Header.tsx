"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              2026衆院選予測AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/">予測</NavLink>
            <NavLink href="/map">選挙区マップ</NavLink>
            <NavLink href="/proportional">比例代表</NavLink>
            <NavLink href="/how-it-works">仕組み</NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニュー"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-2">
              <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>
                予測
              </MobileNavLink>
              <MobileNavLink href="/map" onClick={() => setIsMenuOpen(false)}>
                選挙区マップ
              </MobileNavLink>
              <MobileNavLink
                href="/proportional"
                onClick={() => setIsMenuOpen(false)}
              >
                比例代表
              </MobileNavLink>
              <MobileNavLink
                href="/how-it-works"
                onClick={() => setIsMenuOpen(false)}
              >
                仕組み
              </MobileNavLink>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-slate-300 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-slate-800"
    >
      {children}
    </Link>
  );
}
