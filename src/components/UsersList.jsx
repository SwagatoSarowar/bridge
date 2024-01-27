import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDatabase, onValue, push, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function UsersList() {
  const db = getDatabase();

  const currentUserData = useSelector((state) => state.user.userInfo);

  const [userList, setUserList] = useState([]);
  const [friendReqsIdList, setFriendReqsIdList] = useState([]);
  const [friendsIdList, setFriendsIdList] = useState([]);
  const [blockedIdList, setBlockedIdList] = useState({});

  useEffect(() => {
    onValue(ref(db, "users/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        item.key !== currentUserData.uid &&
          tempArr.push({ ...item.val(), userId: item.key });
      });
      setUserList(tempArr);
    });
  }, [currentUserData.uid, db]);

  useEffect(() => {
    onValue(ref(db, "friendReqs/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        tempArr.push(item.val().senderId + item.val().receiverId);
      });
      setFriendReqsIdList(tempArr);
    });
  }, [db, currentUserData.uid]);

  useEffect(() => {
    onValue(ref(db, "friends/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        tempArr.push(item.val().senderId + item.val().receiverId);
      });
      setFriendsIdList(tempArr);
    });
  }, [db, currentUserData.uid]);

  useEffect(() => {
    onValue(ref(db, "block/"), (snapshot) => {
      const tempBlockedArr = [];
      const tempBlockedByArr = [];
      snapshot.forEach((item) => {
        currentUserData.uid === item.val().blockedUserId
          ? tempBlockedArr.push(item.val().blockedByUserId)
          : tempBlockedByArr.push(item.val().blockedUserId);
      });
      setBlockedIdList({
        blockedById: tempBlockedByArr,
        blockedId: tempBlockedArr,
      });
    });
  }, [db, currentUserData.uid]);

  return (
    <div>
      {userList.length ? (
        <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {userList.map((item, index) => (
            <User
              key={index}
              userData={item}
              currentUserData={currentUserData}
              friendReqsIdList={friendReqsIdList}
              friendsIdList={friendsIdList}
              blockedIdList={blockedIdList}
            />
          ))}
        </div>
      ) : (
        <div className="pt-20 text-center text-xl font-medium text-white/20 md:text-2xl">
          No user available
        </div>
      )}
    </div>
  );
}

function User({
  currentUserData,
  userData,
  friendReqsIdList,
  friendsIdList,
  blockedIdList,
}) {
  const db = getDatabase();
  const navigate = useNavigate();

  const handleAddFriend = function () {
    push(ref(db, "friendReqs/"), {
      senderId: currentUserData.uid,
      senderName: currentUserData.displayName,
      senderImg: currentUserData.photoURL,
      receiverId: userData.userId,
      receiverName: userData.username,
      receiverImg: userData.profileImg,
    });
  };

  return (
    <div className="flex gap-x-10 overflow-hidden rounded-lg border border-white/30 min-[500px]:mx-20 sm:mx-0 sm:block">
      <picture>
        <img
          className="aspect-square w-[125px] cursor-pointer sm:w-full"
          src={userData.profileImg}
          alt={`${userData.username} profile image`}
          onClick={() => navigate(`/${userData.userId}`)}
        />
      </picture>
      <div className="flex flex-col items-start gap-y-3 px-3 pb-5 pt-3 sm:items-stretch">
        <h4
          className="cursor-pointer text-center text-xl font-semibold"
          onClick={() => navigate(`/${userData.userId}`)}
        >
          {userData.username}
        </h4>
        {friendReqsIdList?.includes(currentUserData.uid + userData.userId) ? (
          <p className="mt-2 select-none rounded-md text-center font-medium text-slate-400">
            Request Sent
          </p>
        ) : friendReqsIdList?.includes(
            userData.userId + currentUserData.uid,
          ) ? (
          <p className="mt-2 select-none rounded-md text-center font-medium text-slate-400">
            Request Received
          </p>
        ) : friendsIdList?.includes(userData.userId + currentUserData.uid) ||
          friendsIdList?.includes(currentUserData.uid + userData.userId) ? (
          <p className="mt-2 select-none rounded-md text-center font-medium text-slate-400">
            Friend
          </p>
        ) : blockedIdList.blockedById?.includes(userData.userId) ? (
          <p className="mt-2 select-none rounded-md text-center font-medium text-slate-400">
            User is blocked
          </p>
        ) : blockedIdList.blockedId?.includes(userData.userId) ? (
          <p className="mt-2 select-none rounded-md text-center font-medium text-slate-400">
            You are blocked
          </p>
        ) : (
          <button
            className="block rounded-md bg-green-950 px-4 py-2.5 text-lg font-medium leading-none text-green-400 duration-150 hover:bg-green-800 hover:text-green-300 sm:px-0"
            onClick={handleAddFriend}
          >
            Add Friend
          </button>
        )}
      </div>
    </div>
  );
}
