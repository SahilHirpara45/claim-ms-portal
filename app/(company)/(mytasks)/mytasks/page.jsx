"use client"
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const tasksData = [
  {
    id: 1,
    title: "Fix the Car",
    description: "Create a responsive design for the homepage.",
    dueDate: "2024-07-25",
    status: "in-progress",
  },
  {
    id: 2,
    title: "Fix Bug #123",
    description: "Resolve the issue with the login page.",
    dueDate: "2024-07-26",
    status: "pending",
  },
  // Add more tasks as needed
];

const EmployeeTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setTasks(tasksData); // Simulate fetching tasks from an API
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterTasks(e.target.value, statusFilter);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    filterTasks(searchQuery, e.target.value);
  };

  const filterTasks = (query, status) => {
    let filteredTasks = tasksData;

    if (query) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }

    setTasks(filteredTasks);
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Tasks</h1>
      </div>
      <div className="flex justify-between mb-4">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-1/3"
        />
        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className="w-1/4 p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="shadow-lg">
            <CardHeader>
              <h2 className="text-xl font-medium">{task.title}</h2>
              <p className="text-sm text-gray-500">{task.dueDate}</p>
            </CardHeader>
            <CardContent>
              <p>{task.description}</p>
            </CardContent>
            <CardFooter>
              <span
                className={`px-2 py-1 rounded ${
                  task.status === "completed"
                    ? "bg-green-500 text-white"
                    : task.status === "in-progress"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {task.status}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTasksPage;
