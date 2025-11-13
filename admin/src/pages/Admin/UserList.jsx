import React, { useContext, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Link } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const getToday = () => new Date().toISOString().split("T")[0];

const UserList = () => {
  const { backendUrl, axios, aToken, users, getAllUsers } = useContext(AdminContext);

  const markDelivered = async (userId, mealType) => {
    try {
      const res = await axios.patch(
        `${backendUrl}/api/admin/delivery`,
        {
          userId,
          mealType,
          date: getToday(),
        },
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );

      console.log(res);
      
      getAllUsers();
    } catch (error) {
      toast.error("Failed to update delivery");
    }
  };

  const columns = [
    { accessorKey: "_id", header: "User ID" },

    {
      accessorKey: "delivered",
      header: "Today delivery",
      Cell: ({ row }) => {
        const user = row.original;
        const delivered = user.delivered;
        const today = getToday();

        const breakfast = delivered?.breakfast?.[today] ?? false;
        const lunch = delivered?.lunch?.[today] ?? false;
        const dinner = delivered?.dinner?.[today] ?? false;

        return (
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <b>Breakfast:</b>
              {breakfast ? (
                <span className="text-green-600 font-semibold">✔</span>
              ) : (
                <button
                  onClick={() => markDelivered(user._id, "breakfast")}
                  className="px-2 py-1 bg-blue text-white rounded cursor-pointer"
                >
                  Mark
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <b>Lunch:</b>
              {lunch ? (
                <span className="text-green-600 font-semibold">✔</span>
              ) : (
                <button
                  onClick={() => markDelivered(user._id, "lunch")}
                  className="px-2 py-1 bg-blue text-white rounded cursor-pointer"
                >
                  Mark
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <b>Dinner:</b>
              {dinner ? (
                <span className="text-green-600 font-semibold">✔</span>
              ) : (
                <button
                  onClick={() => markDelivered(user._id, "dinner")}
                  className="px-2 py-1 bg-blue text-white rounded cursor-pointer"
                >
                  Mark
                </button>
              )}
            </div>

          </div>
        );
      },
    },

    { accessorKey: "name", header: "Name" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "subscription", header: "Subscription" },
  ];

  useEffect(() => {
    if (aToken) {
      getAllUsers();
    }
  }, [aToken]);

  return (
    <div className="overflow-y-scroll h-[calc(100vh-80px)] w-full p-6">
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow mb-4">
        <h2 className="text-lg font-bold text-blue">User List</h2>
        <Link to={"/users/add"} className="bg-blue text-white px-3 py-2 rounded-lg">
          Add New
        </Link>
      </div>

      <MaterialReactTable columns={columns} data={users} />
    </div>
  );
};

export default UserList;
