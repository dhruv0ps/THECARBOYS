import { FC } from "react";
import { Dropdown, Navbar } from "flowbite-react";
import { HiLogout } from "react-icons/hi";
import { MdMenu, MdMenuOpen } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import { observer } from 'mobx-react';
import { authStore } from '../store/authStore';

interface NavBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const NavBar: FC<NavBarProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authStore.logout();
    navigate("/login");
  };

  return (
    <Navbar className="bg-white border-b border-gray-300 shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <div className="flex flex-col gap-1">
          <img src={logo} alt="logo" className="w-52 h-12" />
        </div>

        {/* Right-Side User Controls */}
        <div className="flex items-center gap-4">
          {/* User Dropdown */}
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center relative overflow-hidden">
                {authStore.loading ? (
                  <span className="text-sm text-gray-500">Loading...</span>
                ) : (
                  <svg
                    className="w-10 h-10 text-gray-600 -left-1 absolute"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
              </div>
            }
          >
            <Dropdown.Header>
              <span className="block text-base font-medium text-gray-800">
                {authStore.user?.username || "User"}
              </span>
              <span className="block truncate text-sm text-gray-500">
                {authStore.user?.email || "user@example.com"}
              </span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item
              icon={HiLogout}
              onClick={handleLogout}
              className="hover:bg-gray-200 transition duration-200"
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>

          {/* Sidebar Toggle Button */}
          <button
            className="text-gray-600 hover:text-gray-900 lg:hidden focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <MdMenuOpen className="text-3xl transition duration-200" />
            ) : (
              <MdMenu className="text-3xl transition duration-200" />
            )}
          </button>
        </div>
      </div>
    </Navbar>
  );
};

export default observer(NavBar);
