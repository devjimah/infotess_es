
import { NavLink } from "react-router-dom";
import { Button } from "antd";
import {
  UserAddOutlined,
  SettingOutlined,
  LogoutOutlined,
  EditOutlined,
  HistoryOutlined,
  DashboardOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import { useAppContext } from "../context/AppProvider";

function Sidebar() {
  const { handleLogout, isLoggedIn } = useAppContext();

  return (
    <div className="w-56 bg-gray-100 h-screen flex flex-col justify-between p-5">
      <div>
        <h3 className="text-2xl font-semibold mb-6">Dashboard</h3>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard/dashboard"
              className={({ isActive }) =>
                `flex items-center w-full text-left p-2 rounded-md ${
                  isActive
                    ? "bg-blue-500 text-white border-r-4 border-blue-500"
                    : ""
                }`
              }
            >
              <Button
                type="text"
                icon={<DashboardOutlined />}
                className="w-full text-left"
              >
                Dashboard
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/elections"
              className={({ isActive }) =>
                `flex items-center w-full text-left p-2 rounded-md ${
                  isActive
                    ? "bg-blue-500 text-white border-r-4 border-blue-500"
                    : ""
                }`
              }
            >
              <Button
                type="text"
                icon={<EditOutlined />}
                className="w-full text-left"
              >
                Elections
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/create-official"
              className={({ isActive }) =>
                `flex items-center w-full text-left p-2 rounded-md ${
                  isActive
                    ? "bg-blue-500 text-white border-r-4 border-blue-500"
                    : ""
                }`
              }
            >
              <Button
                type="text"
                icon={<UserAddOutlined />}
                className="w-full text-left"
              >
                Officials
              </Button>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/past-elections"
              className={({ isActive }) =>
                `flex items-center w-full text-left p-2 rounded-md ${
                  isActive
                    ? "bg-blue-500 text-white border-r-4 border-blue-500"
                    : ""
                }`
              }
            >
              <Button
                type="text"
                icon={<HistoryOutlined />}
                className="w-full text-left"
              >
                Past Elections
              </Button>
            </NavLink>
          </li>
          {isLoggedIn && (
            <li>
              <NavLink
                to="/otp-screen"
                className={({ isActive }) =>
                  `flex items-center w-full text-left p-2 rounded-md ${
                    isActive
                      ? "bg-blue-500 text-white border-r-4 border-blue-500"
                      : ""
                  }`
                }
              >
                <Button
                  type="text"
                  icon={<SecurityScanOutlined />}
                  className="w-full text-left"
                >
                  OTP Screen
                </Button>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
      <div>
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `flex items-center w-full text-left p-2 rounded-md ${
                  isActive
                    ? "bg-blue-500 text-white border-r-4 border-blue-500"
                    : ""
                }`
              }
            >
              <Button
                type="default"
                icon={<SettingOutlined />}
                className="w-full text-left"
              >
                Settings
              </Button>
            </NavLink>
          </li>
          <li>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              className="flex items-center w-full text-left"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
