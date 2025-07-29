const navLinks = [
  { name: "Home", href: "/" },
  { name: "Drivers", href: "/driver" },
  { name: "Head 2 Head", href: "/head-2-head" },
  { name: "Standings", href: "/standings" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* Top Row: Logo + Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/images/F1-Logo.png"
              alt="F1 Logo"
              className="h-6"
            />
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-wrap gap-4 justify-center sm:justify-end text-sm">
            {navLinks.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-gray-400 hover:text-red-500 transition duration-150"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Row: Personal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
          <p className="text-center sm:text-left">
            Built by Mubashir Asif © {new Date().getFullYear()}
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a
              href="https://github.com/Ihaxxxx"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition"
            >
              GitHub Profile
            </a>
            <a
              href="https://github.com/Ihaxxxx/F1-API"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition"
            >
              Source Code
            </a>
            <a
              href="https://www.linkedin.com/in/mubashir-asif-b25311318/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}