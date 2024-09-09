import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiOutlineUser, AiOutlinePhone, AiOutlineEnvironment, AiOutlineTeam } from "react-icons/ai";
import Image from "next/image";

const UserInfo = ({ userData }) => {
  const userInfo = [
    {
      icon: AiOutlineUser,
      label: "Name",
      value: userData?.data?.userId?.companyName,
    },
    {
      icon: AiOutlinePhone,
      label: "Mobile",
      value: userData?.data?.userId?.mobileNumber,
    },
    {
      icon: AiOutlineEnvironment,
      label: "Location",
      value: userData?.data?.userId?.address,
    },
    {
      icon: AiOutlineEnvironment,
      label: "City",
      value: userData?.data?.userId?.city,
    },
    {
      icon: AiOutlineEnvironment,
      label: "Country",
      value: userData?.data?.userId?.country,
    },
  ];

  const activeTeams = [
    {
      title: "CSR",
      icon: AiOutlineTeam,
      total: userData?.data?.totalCSR,
    },
    {
      title: "Technician",
      icon: AiOutlineTeam,
      total: userData?.data?.totalTechnician,
    },
    {
      title: "Surveyor",
      icon: AiOutlineTeam,
      total: userData?.data?.totalSurveyor,
    },
  ];

  return (
    <Card>
      <CardHeader className="border-none mb-0">
        <CardTitle className="text-lg font-medium text-default-800">Information</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <ul className="mt-6 space-y-4">
          {userInfo.map((item, index) => (
            <li key={`user-info-${index}`} className="flex items-center">
              <div className="flex-none 2xl:w-56 flex items-center gap-1.5">
                <span>
                  <item.icon className="w-4 h-4 text-primary" />
                </span>
                <span className="text-sm font-medium text-default-800">{item.label}:</span>
              </div>
              <div className="flex-1 text-sm text-default-700">{item.value}</div>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-lg font-medium text-default-800 mb-4">Active Teams</div>
        <div className="space-y-3">
          {activeTeams.map((item, index) => (
            <div key={`active-team-${index}`} className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-primary" />
              <div className="text-sm font-medium text-default-800">
                {item.title} <span className="font-normal">({item.total} members)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
