import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Examples", href: "/examples" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Press", href: "/press" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Book a Demo", href: "/demo" },
    { label: "Status", href: "/status" },
    { label: "API Docs", href: "/docs" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-lg font-bold text-gray-900">
              InstantLocal<span className="text-blue-600">Business</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              AI-powered websites for local businesses. Live in 60 seconds.
            </p>
            <p className="mt-4 text-xs text-gray-400">
              © {new Date().getFullYear()} InstantLocalBusiness.com
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {group}
              </h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
