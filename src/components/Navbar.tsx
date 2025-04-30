import { Disclosure, Menu } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

const navigation = [
  { name: "Home", to: "/", current: false },
  { name: "Players", to: "/players", current: false },
  { name: "Games", to: "/games", current: false },
  { name: "Comments", to: "/comments", current: false }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const { logout } = useAuth();
  return (
    <Disclosure as="nav" className="bg-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <span className="text-3xl">🏀</span>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    to={item.to}
                    key={item.name}
                    className={({ isActive }) => {
                      return classNames(
                        isActive
                          ? "bg-red-900 text-white"
                          : "text-gray-300 hover:bg-red-800 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors"
                      );
                    }}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full bg-black p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-hidden"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="relative flex rounded-full bg-black text-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-hidden">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <span className="text-2xl">🏀</span>
              </Menu.Button>
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black py-1 ring-1 ring-red-500 shadow-lg focus:outline-hidden">
                <Menu.Item>
                  <button
                    onClick={() => {
                      logout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-800"
                  >
                    Sign out
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};

export default Navbar;
