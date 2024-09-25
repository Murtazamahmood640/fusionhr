import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";

// Import MUI Icons
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupIcon from "@mui/icons-material/Group";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskIcon from "@mui/icons-material/Task";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import FeedbackIcon from "@mui/icons-material/Feedback";
import TextsmsIcon from "@mui/icons-material/Textsms";
import PaymentsIcon from "@mui/icons-material/Payments";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ViewListIcon from "@mui/icons-material/ViewList";
import DescriptionIcon from "@mui/icons-material/Description"; // Added import
import VisibilityIcon from "@mui/icons-material/Visibility"; // Added import
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; // Added import
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Added import
import PeopleIcon from "@mui/icons-material/People"; // Added import
import AddIcon from "@mui/icons-material/Add"; // Added import
import { AddBox } from "@mui/icons-material";
import { ListAlt } from "@mui/icons-material";
import ListIcon from "@mui/icons-material/List";
import FlagIcon from "@mui/icons-material/Flag";

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isMobile);
  const [selected, setSelected] = useState("Dashboard");
  const [getUser, setgetUser] = useState({});
  const [openDropdown, setOpenDropdown] = useState("");
  const [userRole, setuserRole] = useState("");

  const textColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const hoverColor = "#00a152"; // Green for hover effect
  const activeColor = "#00a152"; // Blue for active state

  useEffect(() => {
    setuserRole(JSON.parse(localStorage.getItem("userRole")));
    setIsSidebarVisible(!isMobile);
    setgetUser(JSON.parse(localStorage.getItem("name")));
  }, [isMobile]);

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setOpenDropdown(path);
  }, [location]);

  const handleDropdownClick = (menu) => {
    if (openDropdown === menu) {
      setOpenDropdown("");
    } else {
      setOpenDropdown(menu);
    }
  };

  return (
    <Box display="flex" height="100vh">
      {isMobile && (
        <IconButton
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1300,
            color: textColor,
          }}
        >
          <MenuOutlinedIcon />
        </IconButton>
      )}

      <Box
        sx={{
          "& .pro-sidebar-inner": {
            backgroundColor: colors.primary[400],
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 20px 5px 0 !important",
            color: textColor, // Set text color based on theme
          },
          "& .pro-inner-item:hover": {
            color: hoverColor + " !important", // Green on hover
          },
          "& .pro-menu-item.active": {
            color: activeColor + " !important", // Blue on active
          },
          display: isSidebarVisible ? "flex" : "none",
          flexDirection: "column",
          overflowY: "auto",
          height: "100vh",
          zIndex: 1200,
          position: isMobile ? "fixed" : "relative",
          width: isCollapsed ? "80px" : "300px",
          transition: "width 0.3s",
          // boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)", // Add box shadow on the right side

        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            {!isMobile && (
              <MenuItem
                onClick={() => setIsCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: "10px 0 20px 0",
                  color: textColor,
                }}
              >
                {!isCollapsed && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                  >
                    <Typography variant="h3" color={textColor}>
                      ABIDI PRO
                    </Typography>
                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>
            )}

            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <AccountCircleIcon
                    style={{ fontSize: 80, color: colors.grey[100] }}
                  />
                </Box>
                <Box textAlign="center">
                  <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ m: "10px 0 0 0" }}
                  >
                    {getUser && getUser.name}
                  </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                    {getUser && getUser.designation}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/dashboard"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              {/* HR manager */}
              {userRole == "HRManager" && (
                <>
                  <SubMenu
                    title="Employee Data"
                    icon={<PeopleOutlinedIcon />}
                    open={openDropdown === "employee"}
                    onOpenChange={() => handleDropdownClick("employee")}
                  >
                    <Item
                      title="Manage Profile"
                      to="/employee/manageprofile"
                      icon={<AccountCircleIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Create User"
                      to="/employee/createuser"
                      icon={<PersonAddAlt1Icon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Team"
                      to="/employee/team"
                      icon={<GroupIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Documents"
                    icon={<DescriptionIcon />}
                    open={openDropdown === "documents"}
                    onOpenChange={() => handleDropdownClick("documents")}
                  >
                    <Item
                      title="Add Document"
                      to="/documents/adddocument"
                      icon={<NoteAddIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Documents"
                      to="/documents/viewdocuments"
                      icon={<DocumentScannerIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Time and Attendance"
                    icon={<AccessAlarmsIcon />}
                    open={openDropdown === "time"}
                    onOpenChange={() => handleDropdownClick("time")}
                  >
                    <Item
                      title="Clock"
                      to="/time/clock"
                      icon={<AccessAlarmsIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Calendar"
                      to="/time/calendar"
                      icon={<CalendarTodayOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Holidays"
                      to="/time/holidays"
                      icon={<HolidayVillageIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Timeoff Request"
                      to="/time/timeoffrequest"
                      icon={<AccessTimeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Timeoff Approval"
                      to="/time/timeoffapproval"
                      icon={<AccountBalanceIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                    title="Expense Claims"
                    icon={<AssignmentTurnedInIcon />}
                    open={openDropdown === "expenseclaims"}
                    onOpenChange={() => handleDropdownClick("expenseclaims")}
                  >
                    <Item
                      title="Expense Claims (For Employees)"
                      to="/expenseclaims/employees"
                      icon={<PeopleIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View All Claims"
                      to="/expenseclaims/viewallclaims"
                      icon={<ViewListIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                    title="Others"
                    icon={<MoreHorizIcon />}
                    open={openDropdown === "others"}
                    onOpenChange={() => handleDropdownClick("others")}
                  >
                    <Item
                      title="Add Feedback"
                      to="/others/addfeedback"
                      icon={<FeedbackIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Chat Support"
                      to="/others/chatsupport"
                      icon={<TextsmsIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                </>
              )}
              {/*end  HR manager */}
              {/* Employee  */}
              {userRole === "Employee" && (
                <>
                  <SubMenu
                    title="Employee Data"
                    icon={<PeopleOutlinedIcon />}
                    open={openDropdown === "employee"}
                    onOpenChange={() => handleDropdownClick("employee")}
                  >
                    <Item
                      title="Manage Profile"
                      to="/employee/manageprofile"
                      icon={<AccountCircleIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                    title="Time and Attendance"
                    icon={<AccessAlarmsIcon />}
                    open={openDropdown === "time"}
                    onOpenChange={() => handleDropdownClick("time")}
                  >
                    <Item
                      title="Clock"
                      to="/time/clock"
                      icon={<AccessAlarmsIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Calendar"
                      to="/time/calendar"
                      icon={<CalendarTodayOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Holidays"
                      to="/time/holidays"
                      icon={<HolidayVillageIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Timeoff Request"
                      to="/time/timeoffrequest"
                      icon={<AccessTimeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Timeoff Approval"
                      to="/time/timeoffapproval"
                      icon={<AccountBalanceIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                    title="Expense Claims"
                    icon={<AssignmentTurnedInIcon />}
                    open={openDropdown === "expenseclaims"}
                    onOpenChange={() => handleDropdownClick("expenseclaims")}
                  >
                    <Item
                      title="Expense Claims (For Employees)"
                      to="/expenseclaims/employees"
                      icon={<PeopleIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View All Claims"
                      to="/expenseclaims/viewallclaims"
                      icon={<ViewListIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                    title="Others"
                    icon={<MoreHorizIcon />}
                    open={openDropdown === "others"}
                    onOpenChange={() => handleDropdownClick("others")}
                  >
                    <Item
                      title="Add Feedback"
                      to="/others/addfeedback"
                      icon={<FeedbackIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Chat Support"
                      to="/others/chatsupport"
                      icon={<TextsmsIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                </>
              )}
              {/*end  Employee */}
              {/* FinanceManager */}
              {userRole === "FinanceManager" &&
                userRole === "SalesManager" &&
                userRole === "ProjectManager" && (
                  <>
                    <SubMenu
                      title="Employee Data"
                      icon={<PeopleOutlinedIcon />}
                      open={openDropdown === "employee"}
                      onOpenChange={() => handleDropdownClick("employee")}
                    >
                      <Item
                        title="Manage Profile"
                        to="/employee/manageprofile"
                        icon={<AccountCircleIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                    <SubMenu
                      title="Time and Attendance"
                      icon={<AccessAlarmsIcon />}
                      open={openDropdown === "time"}
                      onOpenChange={() => handleDropdownClick("time")}
                    >
                      <Item
                        title="Clock"
                        to="/time/clock"
                        icon={<AccessAlarmsIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Calendar"
                        to="/time/calendar"
                        icon={<CalendarTodayOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Holidays"
                        to="/time/holidays"
                        icon={<HolidayVillageIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Timeoff Request"
                        to="/time/timeoffrequest"
                        icon={<AccessTimeIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Timeoff Approval"
                        to="/time/timeoffapproval"
                        icon={<AccountBalanceIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                    <SubMenu
                      title="Payroll"
                      icon={<PaymentsIcon />}
                      open={openDropdown === "payroll"}
                      onOpenChange={() => handleDropdownClick("payroll")}
                    >
                      <Item
                        title="Overview"
                        to="/payroll/overview"
                        icon={<DashboardIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Add Payee"
                        to="/payroll/addpayee"
                        icon={<PersonAddAlt1Icon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="List Of Payees"
                        to="/payroll/payeelist"
                        icon={<GroupIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />

                      <Item
                        title="Add Payment Records"
                        to="/payroll/addpaymentrecords"
                        icon={<PaymentIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="View Payment Records"
                        to="/payroll/viewpaymentrecords"
                        icon={<VisibilityIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Earnings"
                        to="/payroll/earnings"
                        icon={<TrendingUpIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Deductions"
                        to="/payroll/deductions"
                        icon={<FormatListNumberedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                    <SubMenu
                      title="Expense Claims"
                      icon={<AssignmentTurnedInIcon />}
                      open={openDropdown === "expenseclaims"}
                      onOpenChange={() => handleDropdownClick("expenseclaims")}
                    >
                      <Item
                        title="Expense Claims (For Employees)"
                        to="/expenseclaims/employees"
                        icon={<PeopleIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="View All Claims"
                        to="/expenseclaims/viewallclaims"
                        icon={<ViewListIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                    <SubMenu
                      title="Expense"
                      icon={<AccountBalanceWalletIcon />}
                      open={openDropdown === "expense"}
                      onOpenChange={() => handleDropdownClick("expense")}
                    >
                      {/* <Item
                  title="Overview"
                  to="/expense/overview"
                  icon={<DashboardIcon />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
                      <Item
                        title="Add Expense"
                        to="/expense/addexpense"
                        icon={<AddCircleIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="View Expenses"
                        to="/expense/viewexpenses"
                        icon={<VisibilityIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                    <SubMenu
                      title="Billing"
                      icon={<CreditCardIcon />}
                      open={openDropdown === "billing"}
                      onOpenChange={() => handleDropdownClick("billing")}
                    >
                      <Item
                        title="Add Bills"
                        to="/billing/addbills"
                        icon={<AddIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="View Bills"
                        to="/billing/viewbills"
                        icon={<ReceiptOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Add Vendors"
                        to="/billing/addvendors"
                        icon={<StoreIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="View Vendors"
                        to="/billing/viewvendors"
                        icon={<VisibilityIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Add Contractors"
                        to="/billing/addcontractors"
                        icon={<PersonAddAlt1Icon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="View Contractors"
                        to="/billing/viewcontractors"
                        icon={<GroupIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Add Milaege"
                        to="/billing/mileageclaims"
                        icon={<AddBox />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="View Milaege Claims"
                        to="/billing/viewmileageclaims"
                        icon={<ListAlt />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                    <SubMenu
                      title="Others"
                      icon={<MoreHorizIcon />}
                      open={openDropdown === "others"}
                      onOpenChange={() => handleDropdownClick("others")}
                    >
                      <Item
                        title="Add Feedback"
                        to="/others/addfeedback"
                        icon={<FeedbackIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                      <Item
                        title="Chat Support"
                        to="/others/chatsupport"
                        icon={<TextsmsIcon />}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    </SubMenu>
                  </>
                )}
              {/* End FinanceManager */}
              {/* project manager */}
              {userRole === "ProjectManager" && (
                <>
                  <SubMenu
                    title="Documents"
                    icon={<DescriptionIcon />}
                    open={openDropdown === "documents"}
                    onOpenChange={() => handleDropdownClick("documents")}
                  >
                    <Item
                      title="Add Document"
                      to="/documents/adddocument"
                      icon={<NoteAddIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Documents"
                      to="/documents/viewdocuments"
                      icon={<DocumentScannerIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                    title="Project Planning"
                    icon={<CreateNewFolderIcon />} // Example icon for the submenu
                    open={openDropdown === "projectplanning"}
                    onOpenChange={() => handleDropdownClick("projectplanning")}
                  >
                    <Item
                      title="Project Overview"
                      to="/projectplanning/overview"
                      icon={<DashboardIcon />} // DashboardIcon represents an overview or main dashboard
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Create Project"
                      to="/projectplanning/create"
                      icon={<NoteAddIcon />} // NoteAddIcon represents adding or creating new content
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Project List"
                      to="/projects"
                      icon={<ListIcon />} // ListIcon represents a list or collection of items
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Add Milestone"
                      to="/projectplanning/milestones"
                      icon={<FlagIcon />} // FlagIcon represents a milestone or goal
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Milestones"
                      to="/projectplanning/viewmilestones"
                      icon={<VisibilityIcon />} // VisibilityIcon represents viewing or inspecting something
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                </>
              )}
              {/* end project manager */}
              {/* team lead */}
              {userRole === "TeamLead" && (
                <>
                  <SubMenu
                    title="Employee Data"
                    icon={<PeopleOutlinedIcon />}
                    open={openDropdown === "employee"}
                    onOpenChange={() => handleDropdownClick("employee")}
                  >
                    <Item
                      title="Manage Profile"
                      to="/employee/manageprofile"
                      icon={<AccountCircleIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                    title="Time and Attendance"
                    icon={<AccessAlarmsIcon />}
                    open={openDropdown === "time"}
                    onOpenChange={() => handleDropdownClick("time")}
                  >
                    <Item
                      title="Clock"
                      to="/time/clock"
                      icon={<AccessAlarmsIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Calendar"
                      to="/time/calendar"
                      icon={<CalendarTodayOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Holidays"
                      to="/time/holidays"
                      icon={<HolidayVillageIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Timeoff Request"
                      to="/time/timeoffrequest"
                      icon={<AccessTimeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Timeoff Approval"
                      to="/time/timeoffapproval"
                      icon={<AccountBalanceIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                    title="Expense Claims"
                    icon={<AssignmentTurnedInIcon />}
                    open={openDropdown === "expenseclaims"}
                    onOpenChange={() => handleDropdownClick("expenseclaims")}
                  >
                    <Item
                      title="Expense Claims (For Employees)"
                      to="/expenseclaims/employees"
                      icon={<PeopleIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View All Claims"
                      to="/expenseclaims/viewallclaims"
                      icon={<ViewListIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                  <SubMenu
                    title="Others"
                    icon={<MoreHorizIcon />}
                    open={openDropdown === "others"}
                    onOpenChange={() => handleDropdownClick("others")}
                  >
                    <Item
                      title="Add Feedback"
                      to="/others/addfeedback"
                      icon={<FeedbackIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Chat Support"
                      to="/others/chatsupport"
                      icon={<TextsmsIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                </>
              )}
              {/* end team lead */}

              {/* Admin */}

              {userRole === "Admin" && (
                <>
                  <SubMenu
                    title="Employee Data"
                    icon={<PeopleOutlinedIcon />}
                    open={openDropdown === "employee"}
                    onOpenChange={() => handleDropdownClick("employee")}
                  >
                    <Item
                      title="Manage Profile"
                      to="/employee/manageprofile"
                      icon={<AccountCircleIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Create User"
                      to="/employee/createuser"
                      icon={<PersonAddAlt1Icon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Team"
                      to="/employee/team"
                      icon={<GroupIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Documents"
                    icon={<DescriptionIcon />}
                    open={openDropdown === "documents"}
                    onOpenChange={() => handleDropdownClick("documents")}
                  >
                    <Item
                      title="Add Document"
                      to="/documents/adddocument"
                      icon={<NoteAddIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Documents"
                      to="/documents/viewdocuments"
                      icon={<DocumentScannerIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Time and Attendance"
                    icon={<AccessAlarmsIcon />}
                    open={openDropdown === "time"}
                    onOpenChange={() => handleDropdownClick("time")}
                  >
                    <Item
                      title="Clock"
                      to="/time/clock"
                      icon={<AccessAlarmsIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Calendar"
                      to="/time/calendar"
                      icon={<CalendarTodayOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Holidays"
                      to="/time/holidays"
                      icon={<HolidayVillageIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Timeoff Request"
                      to="/time/timeoffrequest"
                      icon={<AccessTimeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Timeoff Approval"
                      to="/time/timeoffapproval"
                      icon={<AccountBalanceIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Payroll"
                    icon={<PaymentsIcon />}
                    open={openDropdown === "payroll"}
                    onOpenChange={() => handleDropdownClick("payroll")}
                  >
                    <Item
                      title="Overview"
                      to="/payroll/overview"
                      icon={<DashboardIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Add Payee"
                      to="/payroll/addpayee"
                      icon={<PersonAddAlt1Icon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="List Of Payees"
                      to="/payroll/payeelist"
                      icon={<GroupIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />

                    <Item
                      title="Add Payment Records"
                      to="/payroll/addpaymentrecords"
                      icon={<PaymentIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Payment Records"
                      to="/payroll/viewpaymentrecords"
                      icon={<VisibilityIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Earnings"
                      to="/payroll/earnings"
                      icon={<TrendingUpIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Deductions"
                      to="/payroll/deductions"
                      icon={<FormatListNumberedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Sales"
                    icon={<AddShoppingCartIcon />}
                    open={openDropdown === "sales"}
                    onOpenChange={() => handleDropdownClick("sales")}
                  >
                    <Item
                      title="Overview"
                      to="/sales/overview"
                      icon={<DashboardIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Add Clients"
                      to="/sales/addclient"
                      icon={<PersonAddAlt1Icon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Clients"
                      to="/sales/viewclients"
                      icon={<GroupIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Add Product"
                      to="/sales/addproduct"
                      icon={<AddShoppingCartIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Product"
                      to="/sales/viewproduct"
                      icon={<FormatListBulletedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Create Invoices"
                      to="/sales/createinvoices"
                      icon={<ReceiptLongIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Invoices"
                      to="/sales/viewinvoices"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Expense"
                    icon={<AccountBalanceWalletIcon />}
                    open={openDropdown === "expense"}
                    onOpenChange={() => handleDropdownClick("expense")}
                  >
                    {/* <Item
                  title="Overview"
                  to="/expense/overview"
                  icon={<DashboardIcon />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
                    <Item
                      title="Add Expense"
                      to="/expense/addexpense"
                      icon={<AddCircleIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Expenses"
                      to="/expense/viewexpenses"
                      icon={<VisibilityIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Expense Claims"
                    icon={<AssignmentTurnedInIcon />}
                    open={openDropdown === "expenseclaims"}
                    onOpenChange={() => handleDropdownClick("expenseclaims")}
                  >
                    <Item
                      title="Expense Claims (For Employees)"
                      to="/expenseclaims/employees"
                      icon={<PeopleIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View All Claims"
                      to="/expenseclaims/viewallclaims"
                      icon={<ViewListIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Billing"
                    icon={<CreditCardIcon />}
                    open={openDropdown === "billing"}
                    onOpenChange={() => handleDropdownClick("billing")}
                  >
                    <Item
                      title="Add Bills"
                      to="/billing/addbills"
                      icon={<AddIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Bills"
                      to="/billing/viewbills"
                      icon={<ReceiptOutlinedIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Add Vendors"
                      to="/billing/addvendors"
                      icon={<StoreIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Vendors"
                      to="/billing/viewvendors"
                      icon={<VisibilityIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Add Contractors"
                      to="/billing/addcontractors"
                      icon={<PersonAddAlt1Icon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Contractors"
                      to="/billing/viewcontractors"
                      icon={<GroupIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Add Milaege"
                      to="/billing/mileageclaims"
                      icon={<AddBox />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Milaege Claims"
                      to="/billing/viewmileageclaims"
                      icon={<ListAlt />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  {/* <SubMenu
                title="Projects"
                icon={<AssignmentIcon />}
                open={openDropdown === "projects"}
                onOpenChange={() => handleDropdownClick("projects")}
              >
                <Item
                  title="Create Project"
                  to="/projects/createproject"
                  icon={<CreateNewFolderIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Assign Tasks"
                  to="/projects/assigntasks"
                  icon={<AssignmentIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Task Status"
                  to="/projects/taskstatus"
                  icon={<TaskIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="My Tasks"
                  to="/projects/mytasks"
                  icon={<TaskIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </SubMenu> */}

                  <SubMenu
                    title="Project Planning"
                    icon={<CreateNewFolderIcon />} // Example icon for the submenu
                    open={openDropdown === "projectplanning"}
                    onOpenChange={() => handleDropdownClick("projectplanning")}
                  >
                    <Item
                      title="Project Overview"
                      to="/projectplanning/overview"
                      icon={<DashboardIcon />} // DashboardIcon represents an overview or main dashboard
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Create Project"
                      to="/projectplanning/create"
                      icon={<NoteAddIcon />} // NoteAddIcon represents adding or creating new content
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Project List"
                      to="/projects"
                      icon={<ListIcon />} // ListIcon represents a list or collection of items
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Add Milestone"
                      to="/projectplanning/milestones"
                      icon={<FlagIcon />} // FlagIcon represents a milestone or goal
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="View Milestones"
                      to="/projectplanning/viewmilestones"
                      icon={<VisibilityIcon />} // VisibilityIcon represents viewing or inspecting something
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Task Management"
                    icon={<AssignmentIcon />} // Example icon
                    open={openDropdown === "taskmanagement"}
                    onOpenChange={() => handleDropdownClick("taskmanagement")}
                  >
                    <Item
                      title="Assign Tasks"
                      to="/taskmanagement/assigntasks"
                      icon={<TaskIcon />} // Example icon for assigning tasks
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Task Status"
                      to="/taskmanagement/taskstatus"
                      icon={<FormatListNumberedIcon />} // Example icon for task status
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="My Tasks"
                      to="/taskmanagement/mytasks"
                      icon={<FormatListNumberedIcon />} // Example icon for task status
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Task Calendar"
                      to="/taskmanagement/taskcalendar"
                      icon={<CalendarTodayOutlinedIcon />} // Example icon for task calendar
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Resource & Time Management"
                    icon={<AccessTimeIcon />} // Example icon
                    open={openDropdown === "resourcetime"}
                    onOpenChange={() => handleDropdownClick("resourcetime")}
                  >
                    <Item
                      title="Resource Allocation"
                      to="/resourcetime/resourceallocation"
                      icon={<GroupIcon />} // Example icon for resource allocation
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Time Tracking"
                      to="/resourcetime/timetracking"
                      icon={<AccessTimeIcon />} // Example icon for time tracking
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Project Analytics & Reporting"
                    icon={<TrendingUpIcon />} // Example icon
                    open={openDropdown === "analyticsreporting"}
                    onOpenChange={() =>
                      handleDropdownClick("analyticsreporting")
                    }
                  >
                    <Item
                      title="Project Dashboard"
                      to="/analyticsreporting/dashboard"
                      icon={<DashboardIcon />} // Example icon for project dashboard
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Performance Reports"
                      to="/analyticsreporting/performance"
                      icon={<AssignmentTurnedInIcon />} // Example icon for performance reports
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Custom Reports"
                      to="/analyticsreporting/customreports"
                      icon={<DescriptionIcon />} // Example icon for custom reports
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Stakeholder Management"
                    icon={<PeopleIcon />} // Example icon
                    open={openDropdown === "stakeholdermanagement"}
                    onOpenChange={() =>
                      handleDropdownClick("stakeholdermanagement")
                    }
                  >
                    <Item
                      title="Add Clients"
                      to="/stakeholdermanagement/addclients"
                      icon={<PersonAddAlt1Icon />} // Example icon for adding clients
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Manage Clients"
                      to="/stakeholdermanagement/manageclients"
                      icon={<GroupIcon />} // Example icon for managing clients
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>

                  <SubMenu
                    title="Others"
                    icon={<MoreHorizIcon />}
                    open={openDropdown === "others"}
                    onOpenChange={() => handleDropdownClick("others")}
                  >
                    <Item
                      title="Add Feedback"
                      to="/others/addfeedback"
                      icon={<FeedbackIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Chat Support"
                      to="/others/chatsupport"
                      icon={<TextsmsIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </SubMenu>
                </>
              )}
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </Box>
  );
};

const Item = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  textColor,
  hoverColor,
  activeColor,
}) => {
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: textColor, // Use the passed text color based on theme
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

export default Sidebar;
