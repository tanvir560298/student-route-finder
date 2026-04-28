import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../auth";

const Home = ({ user }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        navigate("/routes");
      })
      .catch((error) => {
        console.log(error);
        alert("Login failed");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-blue-500 flex items-center justify-center text-3xl shadow-lg">
            🧭
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Student Route Finder
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-blue-200 mb-3">
            আপনার সফরসঙ্গী খুঁজে নিন সহজেই
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            মদিনা বিশ্ববিদ্যালয়ের শিক্ষার্থীদের জন্য সহজ রুট ও সফরসঙ্গী খোঁজার প্ল্যাটফর্ম
          </p>
        </div>

        <div className="space-y-3">
          {user ? (
            <Link
              to="/routes"
              className="block w-full rounded-xl bg-blue-500 py-3 font-semibold hover:bg-blue-600 transition shadow-lg"
            >
              রুটগুলো দেখুন
            </Link>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-blue-500 py-3 font-semibold hover:bg-blue-600 transition shadow-lg"
            >
              Google দিয়ে Login করুন
            </button>
          )}

        </div>

        <p className="mt-8 text-xs text-slate-400">
          Safe • Simple • Student Friendly
        </p>
      </div>
    </div>
  );
};

export default Home;