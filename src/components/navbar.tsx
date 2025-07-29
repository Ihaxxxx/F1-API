'use client';
import { Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname } from "next/navigation";


const navLinks = [
  { name: "Home", href: "/" },
  { name: "Drivers", href: "/driver" },
  { name: "Head 2 Head", href: "/head-2-head" },
  { name: "Standings", href: "/standings" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <Disclosure as="nav" className="bg-black shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex text-f1red-500">
            <div className="flex shrink-0 items-center">
              <a href="/">
              <img
                alt="Your Company"
                src='/images/F1-Logo.png'
                className="h-8 w-auto"
              />
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`font-f1bold text-f1red-600 relative inline-flex items-center px-1 pt-1 text-sm
          ${isActive ? "text-f1red-600 after:w-full" : "text-f1red-600 after:w-0 hover:after:w-full"}
          after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-red-500
          after:transition-all after:duration-300 after:ease-in-out
        `}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>

          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 pb-3 pt-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <DisclosureButton
                key={link.name}
                as="a"
                href={link.href}
                className={`block border-l-4 py-2 pl-3 pr-4 text-base font-f1bold ${isActive
                  ? "bg-red-50 border-red-500 text-red-600"
                  : "border-transparent text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                  }`}
              >
                {link.name}
              </DisclosureButton>
            );
          })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
