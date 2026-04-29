import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InterestedStudents = ({ user }) => {
  const [interestedStudents, setInterestedStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/interested`)
      .then((res) => res.json())
      .then((data) => {
        if (!user) return;

        const filtered = data.filter(
          (item) => item.routeOwnerEmail === user.email
        );

        setInterestedStudents(filtered);
      });
  }, [user]);

  const handleStatusUpdate = (id, newStatus) => {
    fetch(`${import.meta.env.VITE_API_URL}/interested/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          const updated = interestedStudents.map((student) =>
            student._id === id
              ? { ...student, status: newStatus }
              : student
          );

          setInterestedStudents(updated);
        }
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Requests
          </h1>
          <p className="text-slate-500 mt-2">
            আপনার ট্রিপে আগ্রহ দেখানো শিক্ষার্থীরা
          </p>
        </div>

        {interestedStudents.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center shadow-sm border">
            <p className="text-slate-500">No requests yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {interestedStudents.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    {student.interestedName}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {student.interestedEmail}
                  </p>
                </div>

                <div className="text-sm text-slate-600 space-y-1">
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {student.interestedPhone}
                  </p>
                  <p>
                    <span className="font-semibold">District:</span>{" "}
                    {student.routeDistrict}
                  </p>
                </div>

                <div className="mt-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      student.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : student.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {student.status || "pending"}
                  </span>
                </div>

                <div className="mt-4 flex gap-3">
                  {(!student.status || student.status === "pending") && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(student._id, "accepted")
                        }
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(student._id, "rejected")
                        }
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {student.status === "accepted" && (
                    <button
                      onClick={() => navigate(`/chat/${student._id}`)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Open Chat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterestedStudents;