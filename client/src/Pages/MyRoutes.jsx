import { useEffect, useState } from "react";

const MyRoutes = ({ user }) => {
  const [myRoutes, setMyRoutes] = useState([]);
  const [editingRoute, setEditingRoute] = useState(null);

  useEffect(() => {
    if (!user) return;

    fetch(`${import.meta.env.VITE_API_URL}/routes`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((route) => route.email === user.email);
        setMyRoutes(filtered);
      });
  }, [user]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) return;

    fetch(`${import.meta.env.VITE_API_URL}/routes/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          alert("Trip deleted successfully!");
          setMyRoutes(myRoutes.filter((route) => route._id !== id));
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Something went wrong.");
      });
  };

  const handleMarkManaged = (id) => {
    const confirmManaged = window.confirm(
      "Are you sure this trip is fully managed?"
    );

    if (!confirmManaged) return;

    fetch(`${import.meta.env.VITE_API_URL}/routes/${id}/status`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ status: "managed" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          alert("Trip marked as managed!");

          const updatedRoutes = myRoutes.map((route) =>
            route._id === id ? { ...route, status: "managed" } : route
          );

          setMyRoutes(updatedRoutes);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Something went wrong.");
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const updatedRoute = {
      district: form.district.value,
      arrivalDate: form.arrivalDate.value,
      arrivalTime: form.arrivalTime.value,
      phone: form.phone.value,
    };

    fetch(`${import.meta.env.VITE_API_URL}/routes/${editingRoute._id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedRoute),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          alert("Trip updated successfully!");

          const updatedRoutes = myRoutes.map((route) =>
            route._id === editingRoute._id ? { ...route, ...updatedRoute } : route
          );

          setMyRoutes(updatedRoutes);
          setEditingRoute(null);
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Something went wrong.");
      });
  };

  const getTripTypeText = (tripType) => {
    if (tripType === "canManage") return "Can manage vehicle";
    if (tripType === "needOnly") return "Needs travel partner";
    return "Not specified";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            My Trips
          </h1>
          <p className="text-slate-500 mt-2">
            আপনার তৈরি করা ট্রিপগুলো দেখুন, পরিবর্তন করুন বা managed করুন
          </p>
        </div>

        {editingRoute && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-5">
              Edit Trip
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              <input
                name="district"
                defaultValue={editingRoute.district}
                placeholder="District"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  name="arrivalDate"
                  type="date"
                  defaultValue={editingRoute.arrivalDate}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <input
                  name="arrivalTime"
                  type="time"
                  defaultValue={editingRoute.arrivalTime}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <input
                name="phone"
                defaultValue={editingRoute.phone}
                placeholder="Phone"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setEditingRoute(null)}
                  className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {myRoutes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <p className="text-slate-500">You have not created any trips yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {myRoutes.map((route) => {
              const isManaged = route.status === "managed";

              return (
                <div
                  key={route._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {route.district}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {route.university}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        isManaged
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {isManaged ? "Managed" : "Open"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-700">
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {route.arrivalDate}
                    </p>
                    <p>
                      <span className="font-semibold">Time:</span>{" "}
                      {route.arrivalTime}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span> {route.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Trip Type:</span>{" "}
                      {getTripTypeText(route.tripType)}
                    </p>
                    <p>
                      <span className="font-semibold">Vehicle:</span>{" "}
                      {route.vehicleType || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold">People Needed:</span>{" "}
                      {route.peopleNeeded || "Not specified"}
                    </p>

                    {route.note && (
                      <p>
                        <span className="font-semibold">Note:</span> {route.note}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3 mt-5">
                    {!isManaged && (
                      <button
                        onClick={() => handleMarkManaged(route._id)}
                        className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
                      >
                        Mark as Managed
                      </button>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingRoute(route)}
                        className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(route._id)}
                        className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRoutes;