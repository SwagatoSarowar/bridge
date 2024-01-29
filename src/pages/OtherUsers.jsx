import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MainContainer from "../components/MainContainer";
import UsersList from "../components/UsersList";
import FriendReqsList from "../components/FriendReqsList";
import FriendsList from "../components/FriendsList";
import BlockedUserList from "../components/BlockedUserList";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function OtherUsers() {
  const navigate = useNavigate();

  const [listToShow, setListToShow] = useState("users");

  const currentUserData = useSelector((state) => state.user.userInfo);

  console.log(currentUserData);

  useEffect(() => {
    !currentUserData && navigate("/login");
  });

  return (
    <>
      {currentUserData && (
        <div className="min-h-screen bg-dark-400 pb-20 text-light-400">
          <Navbar />
          <div className="fixed mb-5 w-full border-b border-white/20 bg-dark-300 py-[6px]">
            <ul className="flex justify-center gap-x-1 text-sm font-medium md:text-base [&>*]:cursor-pointer [&>*]:rounded-md [&>*]:px-2 [&>*]:py-[6px] [&>*]:duration-150 sm:[&>*]:px-5">
              <li
                className={`${
                  listToShow === "users" && "text-green-500"
                } hover:bg-dark-200`}
                onClick={() => setListToShow("users")}
              >
                Users
              </li>
              <li
                className={`${
                  listToShow === "friendReqs" && "text-green-500"
                } hover:bg-dark-200`}
                onClick={() => setListToShow("friendReqs")}
              >
                Requests
              </li>
              <li
                className={`${
                  listToShow === "friends" && "text-green-500"
                } hover:bg-dark-200`}
                onClick={() => setListToShow("friends")}
              >
                Friends
              </li>
              <li
                className={`${
                  listToShow === "blocks" && "text-green-500"
                } hover:bg-dark-200`}
                onClick={() => setListToShow("blocks")}
              >
                Blocks
              </li>
            </ul>
          </div>
          <div className="mt-20">
            <MainContainer>
              {listToShow === "users" && <UsersList />}
              {listToShow === "friendReqs" && <FriendReqsList />}
              {listToShow === "friends" && <FriendsList />}
              {listToShow === "blocks" && <BlockedUserList />}
            </MainContainer>
          </div>
        </div>
      )}
    </>
  );
}
