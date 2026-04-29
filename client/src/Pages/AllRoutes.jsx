import { useEffect, useState } from "react";

const AllRoutes = ({ user }) => {
  const [routes, setRoutes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [interestedData, setInterestedData] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/routes`)
      .then((res) => res.json())
      .then((data) => setRoutes(data));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/interested`)
      .then((res) => res.json())
      .then((data) => setInterestedData(data));
  }, []);

  const filteredRoutes = routes.filter((route) =>
    route.district?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleInterested = (route) => {
    if (!user) {
      alert("Please login first to show interest.");
      return;
    }

    if (route.email === user.email) {
      alert("You cannot send request to your own trip.");
      return;
    }

    if (route.status === "managed") {
      alert("This trip is already managed.");
      return;
    }

    const alreadyInterested = interestedData.find(
      (item) => item.routeId === route._id && item.interestedEmail === user.email
    );

    if (alreadyInterested) {
      alert("You already sent a request for this trip.");
      return;
    }

    const interestedPhone = prompt("Enter your phone number:");

    if (!interestedPhone) {
      alert("Phone number is required.");
      return;
    }

    const newInterestedData = {
      routeId: route._id,
      routeOwnerName: route.name,
      routeOwnerEmail: route.email,
      routeDistrict: route.district,
      interestedName: user.displayName,
      interestedEmail: user.email,
      interestedPhone,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    fetch(`${import.meta.env.VITE_API_URL}/interested`,{
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newInterestedData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          alert("Your request has been sent!");
          setInterestedData([
            ...interestedData,
            { _id: data.insertedId, ...newInterestedData },
          ]);
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
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Explore Trips
          </h1>
          <p className="text-slate-500 mt-2">
            আপনার জেলার সফরসঙ্গী ও যানবাহন শেয়ারিং খুঁজুন
          </p>
        </div>

        <div className="mb-8 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="জেলা দিয়ে সার্চ করুন..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {filteredRoutes.length === 0 ? (
          <div className="text-center bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-slate-500">No trips found.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoutes.map((route) => {
              const routeInterested = interestedData.filter(
                (item) => item.routeId === route._id
              );

              const alreadyInterested = interestedData.find(
                (item) =>
                  item.routeId === route._id &&
                  item.interestedEmail === user?.email
              );

              const isManaged = route.status === "managed";
              const isOwnTrip = route.email === user?.email;

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
                      <span className="font-semibold">Owner:</span> {route.name}
                    </p>

                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {route.arrivalDate}
                    </p>

                    <p>
                      <span className="font-semibold">Time:</span>{" "}
                      {route.arrivalTime}
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
                        <span className="font-semibold">Note:</span>{" "}
                        {route.note}
                      </p>
                    )}

                    {user ? (
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {route.phone}
                      </p>
                    ) : (
                      <p className="text-amber-600 font-medium">
                        Login to view phone number
                      </p>
                    )}
                  </div>

                  {isManaged ? (
                    <button
                      disabled
                      className="mt-5 w-full rounded-xl bg-slate-300 text-slate-600 py-2.5 font-semibold cursor-not-allowed"
                    >
                      Trip Managed
                    </button>
                  ) : isOwnTrip ? (
                    <button
                      disabled
                      className="mt-5 w-full rounded-xl bg-blue-100 text-blue-700 py-2.5 font-semibold cursor-not-allowed"
                    >
                      Your Trip
                    </button>
                  ) : alreadyInterested ? (
                    <button
                      disabled
                      className="mt-5 w-full rounded-xl bg-slate-300 text-slate-600 py-2.5 font-semibold cursor-not-allowed"
                    >
                      Already Requested
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInterested(route)}
                      className="mt-5 w-full rounded-xl bg-green-600 text-white py-2.5 font-semibold hover:bg-green-700 transition"
                    >
                      Interested
                    </button>
                  )}

                  <div className="mt-5 border-t pt-4">
                    {user ? (
                      <>
                        <p className="font-semibold text-slate-800 mb-2">
                          Interested Students ({routeInterested.length})
                        </p>

                        {routeInterested.length === 0 ? (
                          <p className="text-sm text-slate-500">
                            No one interested yet.
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {routeInterested.map((student) => (
                              <p
                                key={student._id}
                                className="text-sm text-slate-600"
                              >
                                {student.interestedName} -{" "}
                                <span className="capitalize">
                                  {student.status || "pending"}
                                </span>
                              </p>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Login to view interested students.
                      </p>
                    )}
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

export default AllRoutes;