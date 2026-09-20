import Link from "next/link";

const columns = [
  {
    title: "探索",
    links: [
      { href: "/#districts", label: "地區導覽" },
      { href: "/#spots", label: "景點推薦" },
      { href: "/anping", label: "安平專頁" },
      { href: "/#itinerary", label: "一日行程" },
      { href: "/#stays", label: "住宿建議" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-14">
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-[2fr_1fr]">
        <div>
          <span className="font-[family-name:var(--font-serif-tc)] text-lg text-accent">
            台南獨旅
          </span>
          <p className="mt-3 max-w-sm text-sm leading-7 text-muted">
            獻給喜歡一個人慢慢逛的旅人——整理台南最值得走一趟的老街、小吃與行程安排。
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-xs tracking-[0.3em] text-accent">{col.title}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-5xl border-t border-border pt-6 text-xs text-muted">
        <p>內容僅供旅遊參考，出發前請再確認店家與景點最新資訊。</p>
        <p className="mt-1">© {new Date().getFullYear()} 台南獨旅</p>
      </div>
    </footer>
  );
}
