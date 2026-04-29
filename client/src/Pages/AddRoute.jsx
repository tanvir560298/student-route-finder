import { useEffect, useState } from "react";
import { auth } from "../auth";

const AddRoute = () => {
  const [message, setMessage] = useState("");
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetch("/data/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data));
  }, []);

  const handleAddRoute = (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      setMessage("Please login first.");
      return;
    }

    const form = e.target;

    if (form.university.value === "Other") {
      setMessage("Only Madinah students allowed.");
      return;
    }

    const routeData = {
      name: user.displayName,
      email: user.email,
      university: form.university.value,
      district: form.district.value,
      arrivalDate: form.arrivalDate.value,
      arrivalTime: form.arrivalTime.value,
      phone: form.phone.value,
      tripType: form.tripType.value,
      vehicleType: form.vehicleType.value,
      peopleNeeded: form.peopleNeeded.value,
      note: form.note.value,
      status: "open",
    };

    fetch(`${import.meta.env.VITE_API_URL}/routes`,  {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(routeData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          setMessage("Trip created successfully!");
          form.reset();
        }
      });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Create Your Trip
          </h1>
          <p className="text-slate-500 mt-2">
            সফরসঙ্গী খুঁজুন সহজেই 🚀
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
          <form onSubmit={handleAddRoute} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                University
              </label>
              <select
                name="university"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select University
                </option>
                <option value="Islamic University of Madinah">
                  Islamic University of Madinah
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                District
              </label>
              <input
                name="district"
                list="district-list"
                placeholder="Search your district"
                required
                className={inputClass}
              />

              <datalist id="district-list">
                {districts.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Arrival Date
                </label>
                <input
                  name="arrivalDate"
                  type="date"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Arrival Time
                </label>
                <input
                  name="arrivalTime"
                  type="time"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                name="phone"
                placeholder="Enter your phone number"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Trip Type
              </label>
              <select name="tripType" required defaultValue="" className={inputClass}>
                <option value="" disabled>
                  Select trip type
                </option>
                <option value="canManage">I can manage vehicle</option>
                <option value="needOnly">I need travel partner only</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Vehicle Type
                </label>
                <select name="vehicleType" defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Select vehicle
                  </option>
                  <option value="bus">Bus</option>
                  <option value="car">Car</option>
                  <option value="microbus">Microbus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  People Needed
                </label>
                <input
                  name="peopleNeeded"
                  placeholder="Example: 3"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Short Note
              </label>
              <textarea
                name="note"
                placeholder="Example: I can manage a microbus, need 3 more students."
                rows="4"
                className={inputClass}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Create Trip
            </button>
          </form>

          {message && (
            <p className="mt-5 text-center font-medium text-green-600">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddRoute;