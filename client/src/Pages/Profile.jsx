import { useEffect, useState } from "react";

const Profile = ({ user }) => {
  const [myTripsCount, setMyTripsCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [chatsCount, setChatsCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    fetch(`${import.meta.env.VITE_API_URL}/routes`)
      .then((res) => res.json())
      .then((data) => {
        const myTrips = data.filter((trip) => trip.email === user.email);
        setMyTripsCount(myTrips.length);
      });

    fetch(`${import.meta.env.VITE_API_URL}/interested`)
      .then((res) => res.json())
      .then((data) => {
        const myRequests = data.filter(
          (item) => item.routeOwnerEmail === user.email
        );

        const myChats = data.filter(
          (item) =>
            item.status === "accepted" &&
            (item.routeOwnerEmail === user.email ||
              item.interestedEmail === user.email)
        );

        setRequestsCount(myRequests.length);
        setChatsCount(myChats.length);
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-4xl font-bold mb-5">
            {user?.displayName?.charAt(0)}
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            {user?.displayName}
          </h1>

          <p className="text-slate-500 mt-2">{user?.email}</p>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-3xl font-bold text-blue-600">
                {myTripsCount}
              </p>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                My Trips
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-3xl font-bold text-green-600">
                {requestsCount}
              </p>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                Requests
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-3xl font-bold text-purple-600">
                {chatsCount}
              </p>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                Chats
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;