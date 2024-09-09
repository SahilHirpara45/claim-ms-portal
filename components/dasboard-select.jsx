// "use client"

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// const DashboardSelect = () => {
//   return (
//     <Select>
//       <SelectTrigger className="w-[124px]">
//         <SelectValue placeholder="Select Date" className="whitespace-nowrap" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="jan-12">Jan 12</SelectItem>
//         <SelectItem value="jan-13">Jan 13</SelectItem>
//         <SelectItem value="jan-14">Jan 14</SelectItem>
//       </SelectContent>
//     </Select>
//   );
// };

// export default DashboardSelect;

"use client";
import { useState } from "react";

const DashboardSelect = ({ onTabChange }) => {
  const [selectedTab, setSelectedTab] = useState("monthly");

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex">
      <button
        className={`px-4 py-2 ${selectedTab === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
        style={{ borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px" }}
        onClick={() => handleTabChange("monthly")}
      >
        Month
      </button>
      <button
        className={`px-4 py-2 ${selectedTab === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
        style={{ borderTopRightRadius: "5px", borderBottomRightRadius: "5px" }}
        onClick={() => handleTabChange("weekly")}
      >
        Week
      </button>
    </div>
  );
};

export default DashboardSelect;

