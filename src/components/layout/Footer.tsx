import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm">
            <p>予測は参考情報であり、結果を保証するものではありません。</p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/how-it-works"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              予測の仕組み
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center text-slate-500 text-xs">
          <p>2026年 第51回衆議院議員総選挙 AI予測</p>
        </div>
      </div>
    </footer>
  );
}
