import {
  Book,
  ClipBoard,
  DashBoard,
  Graph,
  Cars,
  User,
  Employees,
  Diamond,
  ClipBoard2,
  TaskList
} from "@/components/svg";

export const menusConfig = {
  sidebarNav: {
    classic: [
      {
        isHeader: true,
        title: "menu",
      },

      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/dashboard",
        role: ["superAdmin", "company", "employee"],
      },
      {
        title: "My Task",
        icon: TaskList,
        href: "/my-task/task-list",
        role: ["employee"],
      },
      // {
      //   title: "My Task",
      //   icon: TaskList,
      //   role: ["company", "employee"],
      //   child: [
      //     {
      //       title: "New Jobcards",
      //       href: "/my-task/new-jobcard-list",
      //       icon: ClipBoard,
      //       role: ["company", "employee"],
      //     },
      //     {
      //       title: "New Claims",
      //       href: "/my-task/claim-list",
      //       icon: ClipBoard,
      //       role: ["company", "employee"],
      //     },
      //     {
      //       title: "New Quotations",
      //       href: "/my-task/new-quotations",
      //       icon: ClipBoard,
      //       role: ["company", "employee"],
      //     },

      //   ],
      // },
      {
        title: "Employees",
        icon: Employees,
        href: "/employee-list",
        role: ["company"],
      },
      {
        title: "Customers",
        icon: User,
        href: "/customer-list",
        role: ["company", "employee"],
      },
      {
        title: "Cars",
        icon: Cars,
        href: "/car-list",
        role: ["company", "employee"],
      },
      // {
      //   title: "Job Cards",
      //   icon: ClipBoard,
      //   href: "/jobcard-list",
      //   role: ["company", "employee"],
      // },
      {
        title: "Job Cards",
        icon: ClipBoard,
        role: ["company", "employee"],
        child: [
          {
            title: "All Jobcards",
            href: "/jobcard-list",
            icon: ClipBoard,
            role: ["company", "employee"],
          },
          {
            title: "In Progress Jobcards",
            href: "/inprogress-jobcard",
            icon: ClipBoard,
            role: ["company", "employee"],
          },
          {
            title: "Completed Jobcards",
            href: "/completed-jobcard",
            icon: ClipBoard,
            role: ["company", "employee"],
          },
        ],
      },
      {
        title: "Claims",
        icon: Diamond,
        href: "/claim-list",
        role: ["company", "employee"],
      },
      {
        title: "Quotations",
        icon: ClipBoard2,
        href: "/quotations-list",
        role: ["company", "employee"],
      },
      // {
      //   title: "Invoice",
      //   icon: ClipBoard2,
      //   href: "/invoice/create-invoice",
      //   role: ["company", "employee"],
      // },
      {
        title: "Insurance Companies",
        icon: Book,
        href: "/insurance-list",
        role: ["superAdmin", "company"],
      },
      {
        title: "Companies",
        icon: Graph,
        href: "/admin-company-list",
        role: ["superAdmin"],
        //    child: [
        //   {
        //     title: "Analytics",
        //     href: "/dashboard",
        //     icon: Graph,
        //   },
        //   {
        //     title: "Ecommerce",
        //     href: "/ecommerce",
        //     icon: Cart,
        //   },
        //   {
        //     title: "Project ",
        //     href: "/project",
        //     icon: ClipBoard,
        //   },
        // ],
      },
      // {
      //   title: "Reports",
      //   icon: Graph,
      //   href: "/reports",
      //   role: ["company"],
      // },
    ],
  },
};

// export const menusCompanyConfig = {
//   sidebarNav: {
//     company: [
//       {
//         isHeader: true,
//         title: "menu",
//       },
//       {
//         title: "Dashboard",
//         icon: DashBoard,
//         href: "/dashboard",
//       },
//       {
//         title: "Employees",
//         icon: Graph,
//         href: "/employee-list",
//       },
//       {
//         title: "Job Card",
//         icon: ClipBoard,
//         href: "/jobcard-list",
//       },
//       {
//         title: "Customers",
//         icon: ClipBoard,
//         href: "/customer-list",
//       },
//       {
//         title: "Insurance Companies",
//         icon: DashBoard,
//         href: "/insurance-list",
//       },
//       {
//         title: "Car",
//         icon: Graph,
//         href: "/car-lists",
//       },
//     ],
//   },
// };

// export const menusAdminConfig = {
//   sidebarNav: {
//     admin: [
//       {
//         isHeader: true,
//         title: "menu",
//       },
//       {
//         title: "Dashboard",
//         icon: DashBoard,
//         href: "/dashboard",
//       },
//       {
//         title: "Companies",
//         icon: Graph,
//         href: "/admin-company-list",
//       },
//     ],
//   },
// };
