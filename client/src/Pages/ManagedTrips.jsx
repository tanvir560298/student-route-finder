import { useEffect, useState } from "react";

const ManagedTrips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/routes")
      .then((res) => res.json())
      .then((data) => {
        const managedTrips = data.filter((trip) => trip.status === "managed");
        setTrips(managedTrips);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Managed Trips
          </h1>
          <p className="text-slate-500 mt-2">
            সফলভাবে manage হওয়া trip গুলো
          </p>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <p className="text-slate-500">No managed trips yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {trip.district}
                    </h3>
                    <p className="text-sm text-slate-500">{trip.university}</p>
                  </div>

                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Managed
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold">Owner:</span> {trip.name}
                  </p>
                  <p>
                    <span className="font-semibold">Vehicle:</span>{" "}
                    {trip.vehicleType || "Not specified"}
                  </p>
                  <p>
                    <span className="font-semibold">People Needed:</span>{" "}
                    {trip.peopleNeeded || "Not specified"}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {trip.arrivalDate}
                  </p>
                  <p>
                    <span className="font-semibold">Time:</span>{" "}
                    {trip.arrivalTime}
                  </p>
                </div>

                {trip.note && (
                  <p className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                    {trip.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagedTrips;