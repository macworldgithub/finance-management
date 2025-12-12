"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, LogOut, User } from "lucide-react";
import { GoBellFill } from "react-icons/go";
import { MdMessage } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { Dropdown, message } from "antd";

interface NavbarProps {
  onExcelUploadClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onExcelUploadClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        messageRef.current &&
        !messageRef.current.contains(event.target as Node)
      ) {
        setShowMessages(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    message.success("Logged out successfully");
  };

  const notifications = [
    { id: 1, title: "New user registered", time: "2 min ago", unread: true },
    {
      id: 2,
      title: "Server backup completed",
      time: "15 min ago",
      unread: true,
    },
    { id: 3, title: "Payment received", time: "1 hour ago", unread: false },
    {
      id: 4,
      title: "New comment on your post",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 5,
      title: "System update available",
      time: "3 hours ago",
      unread: false,
    },
    { id: 6, title: "Task assigned to you", time: "5 hours ago", unread: true },
    { id: 7, title: "Task assigned to you", time: "8 hours ago", unread: true },
    { id: 8, title: "Task assigned to you", time: "9 hours ago", unread: true },
  ];

  const userMenuItems = [
    {
      key: "profile",
      label: (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Profile</span>
        </div>
      ),
    },
    {
      key: "logout",
      label: (
        <div className="flex items-center space-x-2 text-red-600">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </div>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <div className="bg-gray-100 flex justify-center items-center py-3 relative">
      <nav className="w-[96%] max-w-[1600px] bg-white rounded-2xl shadow-md px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <span className="text-xl font-semibold text-gray-900">GRC</span>
          <FaPlay className="h-4 w-4 text-blue-500" />
        </div>

        {/* Center: Excel Upload + Search */}
        <div className="flex items-center space-x-3 flex-1 max-w-xl mx-8">
          <button
            onClick={onExcelUploadClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition"
          >
            Excel Upload
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search something"
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-5">
          {/* Notification */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
              }}
              className="relative p-1 rounded-full hover:bg-gray-100 transition"
            >
              <GoBellFill className="h-5 w-5 text-gray-800" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {notifications.filter((n) => n.unread).length}
              </span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white  rounded-lg shadow-lg border border-gray-200 z-9999">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                        notif.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p
                          className={`text-sm font-medium ${
                            notif.unread ? "text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {notif.title}
                        </p>
                        {notif.unread && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="relative" ref={messageRef}>
            <button
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
              }}
              className="relative p-1 rounded-full hover:bg-gray-100 transition"
            >
              <MdMessage className="h-5 w-5 text-gray-800" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {notifications.filter((n) => n.unread).length}
              </span>
            </button>
            {showMessages && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-9999">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Messages
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition flex items-start space-x-3 ${
                        notif.unread ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p
                            className={`text-sm font-medium truncate ${
                              notif.unread ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {notif.title}
                          </p>
                          {notif.unread && (
                            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {notif.time}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    View all messages
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md transition">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-gray-500">{user?.role || "User"}</p>
              </div>
            </div>
          </Dropdown>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
