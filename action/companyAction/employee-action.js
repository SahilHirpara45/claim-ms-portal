import { CreateEmployee, DeleteEmployee, GetCSREmployees, GetEmployees, getEmployeeById, updateEmployeeById } from "../../config/companyConfig/employee.config";

export const addEmployee = async (data) => {
    const response = await CreateEmployee(data);
    return response;
};

export const getAllEmployee = async ({ page = 1, size = 10, all = false, search = "" }) => {
    const response = await GetEmployees({ page, size, all, search });
    return response;
}

export const deleteEmployee = async (data) => {
    const response = await DeleteEmployee(data);
    return response;
}
export const getSingleEmployeeAction = async (id) => {
    const response = await getEmployeeById(id);
    return response.data;
};

export const updateEmployee = async (id, updatedFields) => {
    const response = await updateEmployeeById(id, updatedFields);
    return response;
};

///CSR Employee
export const getCSREmployeeAction = async ({ all = false, designation = "" }) => {
    const response = await GetCSREmployees({ all, designation });
    return response;
}