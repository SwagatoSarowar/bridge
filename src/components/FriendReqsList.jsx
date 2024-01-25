import { getDatabase, onValue, push, ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function FriendReqsList() {
  const db = getDatabase();

  const [requestList, setRequestList] = useState([]);

  const currentUserData = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    onValue(ref(db, "friendReqs/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        currentUserData.uid === item.val().receiverId &&
          tempArr.push({ ...item.val(), id: item.key });
      });
      setRequestList(tempArr);
    });
  }, [currentUserData.uid, db]);

  return (
    <div>
      {requestList.length ? (
        <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {requestList.map((item, index) => (
            <FriendReq key={index} requestData={item} />
          ))}
        </div>
      ) : (
        <div className="pt-20 text-center text-xl font-medium text-white/20 md:text-2xl">
          You don&apos;t have any friend request
        </div>
      )}
    </div>
  );
}

function FriendReq({ requestData }) {
  const db = getDatabase();

  const handleAcceptReq = function () {
    push(ref(db, "friends/"), { ...requestData }).then(() =>
      remove(ref(db, "friendReqs/" + requestData.id)),
    );
  };

  const handleDeleteReq = function () {
    if (confirm("Do you want to delete the request ?")) {
      remove(ref(db, "friendReqs/" + requestData.id));
    }
  };

  return (
    <div className="flex gap-x-4 overflow-hidden rounded-lg border border-white/30 min-[500px]:mx-20 sm:mx-0 sm:block">
      <picture>
        <img
          className="w-[125px] sm:w-full"
          src={requestData.senderImg}
          alt=""
        />
      </picture>
      <div className="flex flex-col items-start gap-y-3 px-3 pb-5 pt-3 sm:items-stretch">
        <h4 className="text-center text-xl font-semibold">
          {requestData.senderName}
        </h4>
        <div className="flex gap-x-2 gap-y-2 text-white sm:flex-col">
          <button
            className="block rounded-md bg-green-700 px-4 py-2.5 text-lg font-medium leading-none duration-150 hover:bg-green-800 sm:px-0"
            onClick={handleAcceptReq}
          >
            Accept
          </button>
          <button
            className="block rounded-md bg-red-700 px-4 py-2.5 text-lg font-medium leading-none duration-150 hover:bg-red-800 sm:px-0"
            onClick={handleDeleteReq}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
