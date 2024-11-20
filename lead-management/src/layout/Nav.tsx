import { FC } from "react";
import { Dropdown, Navbar } from "flowbite-react";
import { Bell, Search, Settings } from "lucide-react";
import { HiLogout } from "react-icons/hi";
import { MdMenu, MdMenuOpen } from "react-icons/md";
import { useNavigate } from "react-router-dom";


interface NavBarProps {
  toggleSidebar: () => void; // Function to toggle the sidebar
  isSidebarOpen: boolean; // Boolean to track sidebar state
}

const NavBar: FC<NavBarProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <Navbar className="bg-white border-b border-gray-300 shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Left-Side Breadcrumb Navigation */}
        <div className="flex flex-col gap-1">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            {/* <a href="#" className="hover:text-gray-900">
              Dashboard
            </a>
            <span>/</span>
            <a href="#" className="hover:text-gray-900">
              Home
            </a> */}
          </nav>
          <h1 className="text-lg font-semibold text-gray-800">THE CAR BOYS</h1>
        </div>

        {/* Right-Side User Controls */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-600" />
            <input
              type="search"
              placeholder="Search"
              className="w-[200px] sm:w-[300px] pl-8 text-sm border border-gray-300 rounded-md focus:ring focus:ring-gray-400"
            />
          </div>

          {/* Notifications Icon */}
          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
            <span className="text-sm hidden lg:block">Sign In</span>
          </button>

          {/* Settings Icon */}
          <button className="text-gray-600 hover:text-gray-900">
            <Settings className="h-5 w-5" />
          </button>

          {/* User Dropdown */}
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center relative overflow-hidden">
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
              </div>
            }
          >
            <Dropdown.Header>
              <span className="block text-base font-medium text-gray-800">User </span>
              <span className="block truncate text-sm text-gray-500">user@example.com</span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item
              icon={HiLogout}
              onClick={() => {
                navigate("/login");
              }}
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

export default NavBar;