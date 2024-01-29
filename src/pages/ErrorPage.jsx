import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen items-center justify-center bg-red-500">
      <div className="flex flex-col items-center gap-y-8 rounded-lg bg-white p-3 shadow-[15px_15px_30px_0_rgba(0,0,0,0.75)] md:p-10">
        <h1 className="text-xl font-semibold text-blue-950 md:text-4xl">
          404 Not Found
        </h1>
        <button
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow-[5px_5px_10px_0_rgba(0,0,0,0.4)] duration-200 hover:-translate-y-[2px] hover:bg-blue-700 hover:shadow-[7px_7px_14px_0_rgba(0,0,0,0.5)] md:text-lg"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
