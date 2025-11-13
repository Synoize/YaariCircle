import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';
import ButtonLoader from '../../components/ButtonLoader';

const AddUser = () => {
  const { backendUrl, axios, aToken } = useContext(AdminContext);

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    subscription: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(`${backendUrl}/api/admin/add-user`, userData, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });

      if (data.success) {
        toast.success('User added successfully!');
        setUserData({
          name: "",
          phone: "",
          subscription: "",
          address: ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error(data.message || 'Failed to add user!');
      }

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add user!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-6 md:p-12">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-8 text-gray-800">
          Add New User
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 text-gray-700"
        >
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter user name"
              required
              className="border border-zinc-300 rounded w-full p-2 mt-1 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              pattern="[0-9]{10}"
              maxLength="10"
              required
              className="border border-zinc-300 rounded w-full p-2 mt-1 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Subscription (in days)</label>
            <input
              type="number"
              min="1"
              name="subscription"
              value={userData.subscription}
              onChange={handleChange}
              placeholder="Enter subscription duration"
              required
              className="border border-zinc-300 rounded w-full p-2 mt-1 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={userData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
              className="border border-zinc-300 rounded w-full p-2 mt-1 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-full">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue text-white w-full py-2 rounded-md text-base disabled:opacity-50 hover:bg-blue transition-all cursor-pointer"
            >
              {loading ? <ButtonLoader /> : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
