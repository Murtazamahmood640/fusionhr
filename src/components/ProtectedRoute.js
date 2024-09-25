import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ Component }) => {
    const rolesPermissions = {
        HRManager: [
            '/dashboard',
            "/employee/createuser",
            "/employee/team",
            "/employee/manageprofile",
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            '/time/timeoffapproval',
            '/expenseclaims/employees',
            '/expenseclaims/viewallclaims',
            '/others/addfeedback',
            '/others/chatsupport',  
            "/documents/adddocument",
            "/documents/viewdocuments"
            // Add other Manager-specific routes if needed
        ],
        Admin: [
            "/dashboard",
            "/time/calendar",
            "/time/clock",
            "/time/holidays",
            "/time/timeoffrequest",
            "/time/timeoffapproval",
            "/payroll/overview",
            "/payroll/addpayee",
            "/payroll/addpaymentrecords",
            "/payroll/payeelist",
            "/payroll/viewpaymentrecords",
            "/payroll/earnings",
            "/payroll/deductions",
            "/sales/overview",
            "/sales/addclient",
            "/sales/createinvoices",
            "/sales/addproduct",
            "/sales/viewclients",
            "/sales/viewinvoices",
            "/sales/viewproduct",
            "/projects/createproject",
            "/projects/assigntasks",
            "/employee/createuser",
            "/employee/team",
            "/documents/adddocument",
            "/documents/viewdocuments",
            "/expense/overview",
            "/expense/addexpense",
            "/expense/viewexpenses",
            "/expenseclaims/employees",
            "/expenseclaims/viewallclaims",
            "/projectplanning/create",
            "/projectplanning/overview",
            "/projects",
            "/projects/:projectId",
            "/projectplanning/milestones",
            "/projectplanning/viewmilestones",
            "/taskmanagement/assigntasks",
            "/taskmanagement/taskstatus",
            "/taskmanagement/mytasks",
            "/taskmanagement/taskcalendar",
            "/others/addfeedback",
            "/others/chatsupport",
            "/billing/addcontractors",
            "/billing/addvendors",
            "/billing/viewcontractors",
            "/billing/viewvendors",
            "/billing/addbills",
            "/billing/viewbills",
            "/billing/mileageclaims",
            "/billing/viewmileageclaims",
            "/contacts",
            "/invoices",
            "/submitfeedbacks",
            "/earninganddeductions",
            "/view",
            "/viewInvoice/:id",
            "/project/:projectName",
            "/employee/manageprofile",
            "/main",
            "/barchart",
            "/pie",
            "/piechart",
            "/line",
            "/faq",
            "/geography",
            "/check",
            "/clockgrid"
        ],
        Employee: [
            '/dashboard',
            '/employee/manageprofile',
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            '/time/timeoffapproval',
            '/expenseclaims/employees',
            '/expenseclaims/viewallclaims',
            '/others/addfeedback',
            '/others/chatsupport'
        ],
        FinanceManager: [
            '/dashboard',
            '/dashboard',
            '/employee/manageprofile',
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            '/time/timeoffapproval',
            "/payroll/overview",
            "/payroll/addpayee",
            "/payroll/addpaymentrecords",
            "/payroll/payeelist",
            "/payroll/viewpaymentrecords",
            "/payroll/earnings",
            "/payroll/deductions",
            "/expense/overview",
            "/expense/addexpense",
            "/expense/viewexpenses",
            "/expenseclaims/employees",
            "/expenseclaims/viewallclaims",
            "/billing/addcontractors",
            "/billing/addvendors",
            "/billing/viewcontractors",
            "/billing/viewvendors",
            "/billing/addbills",
            "/billing/viewbills",
            "/billing/mileageclaims",
            "/billing/viewmileageclaims",
            '/others/addfeedback',
            '/others/chatsupport'
        ],
        SalesManager: [
            '/dashboard',
            '/employee/manageprofile',
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            '/time/timeoffapproval',
            "/payroll/overview",
            "/payroll/addpayee",
            "/payroll/addpaymentrecords",
            "/payroll/payeelist",
            "/payroll/viewpaymentrecords",
            "/payroll/earnings",
            "/payroll/deductions",
            "/expense/overview",
            "/expense/addexpense",
            "/expense/viewexpenses",
            "/expenseclaims/employees",
            "/expenseclaims/viewallclaims",
            "/billing/addcontractors",
            "/billing/addvendors",
            "/billing/viewcontractors",
            "/billing/viewvendors",
            "/billing/addbills",
            "/billing/viewbills",
            "/billing/mileageclaims",
            "/billing/viewmileageclaims",
            '/others/addfeedback',
            '/others/chatsupport'
        ],
        ProjectManager: [
            '/dashboard',
            '/employee/manageprofile',
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            '/time/timeoffapproval',
            "/payroll/overview",
            '/projectplanning/create',
            '/projects',
            '/projects/:projectId',
            '/projectplanning/milestones',
            "/projectplanning/viewmilestones",
            // task
            "/taskmanagement/assigntasks",
            "/taskmanagement/taskstatus",
            "/taskmanagement/mytasks",
            "/taskmanagement/taskcalendar",
            // payroll
            "/payroll/addpayee",
            "/payroll/addpaymentrecords",
            "/payroll/payeelist",
            "/payroll/viewpaymentrecords",
            "/payroll/earnings",
            "/payroll/deductions",
            "/expense/overview",
            "/expense/addexpense",
            "/expense/viewexpenses",
            "/expenseclaims/employees",
            "/expenseclaims/viewallclaims",
            '/others/addfeedback',
            '/others/chatsupport'
        ],
        TeamLead: [
            '/dashboard',
            '/employee/manageprofile',
            '/time/calendar',
            '/time/clock',
            '/time/holidays',
            '/time/timeoffrequest',
            '/time/timeoffapproval',
            '/expenseclaims/viewallclaims',
            '/expenseclaims/employees',
            '/others/addfeedback',
            '/others/chatsupport'
        ]
    };


    const navigate = useNavigate();
    const location = useLocation();
    // const { isLoggedIn } = useAuth(); // Optional, if using context
    const isLoggedIn = localStorage.getItem("login");
    const getLoggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    console.log("getLoggedInUser", getLoggedInUser)
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }
        else {
            const currentPath = location.pathname; // Get current route path
            const userRole = getLoggedInUser?.status; // Get the user's role
            localStorage.setItem("userRole", JSON.stringify(userRole))
            console.log("userRole", userRole)
            // Check if the user has permission for the current route
            const allowedRoutes = rolesPermissions[userRole] || [];
            if (!allowedRoutes.includes(currentPath)) {
                navigate("/unauthorized"); // Redirect if the user doesn't have access
            }
        }
    }, [isLoggedIn, navigate]);

    return (
        isLoggedIn ? <Component /> : null
    );
};

export default ProtectedRoute;
