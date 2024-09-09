import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiOutlineUser, AiOutlineMail, AiOutlineIdcard, AiOutlineCar, AiOutlineTeam } from "react-icons/ai";
import { CgOrganisation } from "react-icons/cg";

const UserInfo = ({ userData }) => {
  const user = userData?.data?.userId || {};
  const permissions = user?.permissionId || {};

  const userInfo = [
    {
      icon: AiOutlineUser,
      label: "Name",
      value: `${user.firstName} ${user.lastName}`,
    },
    {
      icon: AiOutlineMail,
      label: "Email",
      value: user.email,
    },
  ];

  const userPermissions = [
    {
      icon: AiOutlineIdcard,
      label: "Job Card",
      value: permissions.jobCard,
    },
    {
      icon: CgOrganisation,
      label: "Insurance Company",
      value: permissions.insuranceCompany,
    },
    {
      icon: AiOutlineCar,
      label: "Cars",
      value: permissions.cars,
    },
    {
      icon: AiOutlineTeam,
      label: "Customers",
      value: permissions.customers,
    },
  ];

  const renderPermission = (permission) => (
    <ul className="ml-4 space-y-1">
      <li>Create: {permission?.create ? "Yes" : "No"}</li>
      <li>Edit: {permission?.update ? "Yes" : "No"}</li>
      <li>Delete: {permission?.delete ? "Yes" : "No"}</li>
      <li>View: {permission?.view ? "Yes" : "No"}</li>
    </ul>
  );

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
        <div className="mt-6 text-lg font-medium text-default-800 mb-4">Permissions</div>
        <ul className="space-y-4">
          {userPermissions.map((item, index) => (
            <li key={`user-permission-${index}`} className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-default-800">{item.label}:</span>
              </div>
              <div className="flex-1 text-sm text-default-700">
                {renderPermission(item.value)}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
