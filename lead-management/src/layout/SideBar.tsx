import React from "react";
import { Sidebar } from "flowbite-react";
import { HiOutlineMinusSm, HiOutlinePlusSm } from "react-icons/hi";
import { FaUsers, FaUser, FaBoxOpen } from 'react-icons/fa';
import { HiChartBar } from 'react-icons/hi';
import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import "./NavSideBar.css"; // Import CSS file

type NavSideBarProps = {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const sidebarTheme = {
    "root": {
        "base": "h-full",
        "collapsed": {
            "on": "w-16",
            "off": "w-64"
        },
        "inner": "h-full overflow-y-auto overflow-x-hidden rounded-t-xl bg-white px-3 py-4 shadow-md"
    },
    "collapse": {
        "button": "group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-700 transition duration-75 hover:bg-gray-100",
        "icon": {
            "base": "collapse-icon",
            "open": {
                "off": "",
                "on": "text-gray-600"
            }
        },
        "label": {
            "base": "ml-3 flex-1 whitespace-nowrap text-left",
            "icon": {
                "base": "h-6 w-6 transition delay-0 ease-in-out",
                "open": {
                    "on": "rotate-180",
                    "off": ""
                }
            }
        },
        "list": "space-y-2 py-2"
    },
    "item": {
        "base": "sidebar-item",
        "active": "sidebar-item-active",
        "collapsed": {
            "insideCollapse": "group w-full pl-8 transition duration-75",
            "noIcon": "font-bold"
        },
        "content": {
            "base": "flex-1 whitespace-nowrap px-3"
        },
        "icon": {
            "base": "collapse-icon",
            "active": "text-gray-900"
        },
        "label": "",
        "listItem": ""
    },
    "items": {
        "base": ""
    },
    "itemGroup": {
        "base": "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0"
    },
    "logo": {
        "base": "sidebar-logo"
    }
};

const renderChevronIcon = (theme: any, open: boolean) => {
    const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm;
    const iconClass = twMerge(
        theme?.collapse?.label?.icon?.open?.[open ? "on" : "off"] || "text-gray-500"
    );

    return <IconComponent aria-hidden className={iconClass} />;
};

const NavSideBar: React.FC<NavSideBarProps> = ({ isSidebarOpen }) => {
    const location = useLocation();

    return (
        <Sidebar
            theme={sidebarTheme}
            aria-label="Sidebar"
            className={`nav-sidebar ${isSidebarOpen ? "" : "hidden"}`}
        >
            <div className="sidebar-logo">
                <span>My Dashboard</span>
            </div>

            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item
                        as={Link}
                        to="/"
                        icon={HiChartBar}
                        className={location.pathname === "/" ? "sidebar-item-active" : "sidebar-item"}
                    >
                        Dashboard
                    </Sidebar.Item>

                    {/* Leads Section */}
                    <Sidebar.Collapse
                        icon={FaUser}
                        label="Leads"
                        renderChevronIcon={(theme, open) => renderChevronIcon(theme, open)}
                        aria-expanded={isSidebarOpen}
                    >
                        <Sidebar.Item
                            as={Link}
                            to="/leads/view"
                            className={location.pathname === "/leads/view" ? "sidebar-item-active" : "sidebar-item"}
                        >
                            View Leads
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            to="/leads/add"
                            className={location.pathname === "/leads/add" ? "sidebar-item-active" : "sidebar-item"}
                        >
                            Add Leads
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            to="/leads/category"
                            className={location.pathname === "/leads/category" ? "sidebar-item-active" : "sidebar-item"}
                        >
                             Leads Categories
                        </Sidebar.Item>
                    </Sidebar.Collapse>

                    {/* Inventory Section */}
                    <Sidebar.Collapse
                        icon={FaBoxOpen}
                        label="Inventory"
                        renderChevronIcon={(theme, open) => renderChevronIcon(theme, open)}
                        aria-expanded={isSidebarOpen}
                    >
                        <Sidebar.Item
                            as={Link}
                            to="/inventory/view"
                            className={location.pathname === "/inventory/view" ? "sidebar-item-active" : "sidebar-item"}
                        >
                            View Inventory
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            to="/inventory/add"
                            className={location.pathname === "/inventory/add" ? "sidebar-item-active" : "sidebar-item"}
                        >
                            Add Car
                        </Sidebar.Item>
                    </Sidebar.Collapse>

                    {/* Users Section */}
                    <Sidebar.Collapse
                        icon={FaUsers}
                        label="Users"
                        renderChevronIcon={(theme, open) => renderChevronIcon(theme, open)}
                        aria-expanded={isSidebarOpen}
                    >
                        <Sidebar.Item
                            as={Link}
                            to="/users/view"
                            className={location.pathname === "/users/view" ? "sidebar-item-active" : "sidebar-item"}
                        >
                            View Users
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            to="/users/add"
                            className={location.pathname === "/users/add" ? "sidebar-item-active" : "sidebar-item"}
                        >
                            Add Users
                        </Sidebar.Item>
                    </Sidebar.Collapse>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default NavSideBar;
