import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLoginInfo } from "../slices/userSlice";
import Navbar from "../components/Navbar";

export default function Home() {
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userInfo);

  const [verified, setVerified] = useState(false);

  useEffect(() => {
    !userData && navigate("/login");
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setVerified(user.emailVerified);
      dispatch(() => userLoginInfo(user));
      localStorage.setItem("userLoginInfo", JSON.stringify(user));
    });
  });

  return (
    <div>
      {verified ? (
        <div className="min-h-screen bg-dark-400 text-white">
          <Navbar />
          this is home
        </div>
      ) : (
        <VerifyModal onNavigate={navigate} />
      )}
    </div>
  );
}

function VerifyModal({ onNavigate }) {
  return (
    <div className="flex h-screen items-center justify-center bg-blue-300">
      <div className="flex flex-col items-center gap-y-8 rounded-lg bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-semibold text-blue-950">
          Please verify your email to login
        </h1>
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-lg font-semibold text-white shadow-[5px_5px_10px_0_rgba(0,0,0,0.4)] duration-200 hover:-translate-y-[2px] hover:bg-red-600 hover:shadow-[7px_7px_14px_0_rgba(0,0,0,0.5)]"
          onClick={() => onNavigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
