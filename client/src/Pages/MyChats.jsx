import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyChats = ({ user }) => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetch(`${import.meta.env.VITE_API_URL}/interested`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (item) =>
            item.status === "accepted" &&
            (item.routeOwnerEmail === user.email ||
              item.interestedEmail === user.email)
        );

        setChats(filtered);
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            My Chats
          </h1>
          <p className="text-slate-500 mt-2">
            Accepted trips থেকে আপনার conversations দেখুন
          </p>
        </div>

        {chats.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100">
            <p className="text-slate-500">No chats yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => {
              const otherPerson =
                chat.routeOwnerEmail === user.email
                  ? chat.interestedName
                  : chat.routeOwnerName;

              const roleText =
                chat.routeOwnerEmail === user.email
                  ? "Interested student"
                  : "Trip owner";

              return (
                <div
                  key={chat._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-11 w-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {otherPerson?.charAt(0)}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {otherPerson}
                        </h3>
                        <p className="text-sm text-slate-500">{roleText}</p>
                      </div>
                    </div>

                    <div className="text-sm text-slate-600 space-y-1">
                      <p>
                        <span className="font-semibold">District:</span>{" "}
                        {chat.routeDistrict}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        <span className="text-green-600 font-semibold">
                          {chat.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/chat/${chat._id}`)}
                    className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Open Chat
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;