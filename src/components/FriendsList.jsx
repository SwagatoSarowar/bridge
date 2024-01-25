import { getDatabase, onValue, push, ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function FriendsList() {
  const db = getDatabase();

  const currentUserData = useSelector((state) => state.user.userInfo);

  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    onValue(ref(db, "friends/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        (currentUserData.uid === item.val().senderId ||
          currentUserData.uid === item.val().receiverId) &&
          tempArr.push({ ...item.val(), id: item.key });
      });
      setFriendList(tempArr);
    });
  }, [db, currentUserData.uid]);

  return (
    <div>
      {friendList.length ? (
        <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {friendList.map((item, index) => (
            <Friend key={index} data={item} currentUserData={currentUserData} />
          ))}
        </div>
      ) : (
        <div className="pt-20 text-center text-xl font-medium text-white/20 md:text-2xl">
          You don&apos;t have any friends
        </div>
      )}
    </div>
  );
}

function Friend({ data, currentUserData }) {
  const db = getDatabase();

  const friendData = {};

  if (data.senderId === currentUserData.uid) {
    friendData.name = data.receiverName;
    friendData.id = data.receiverId;
    friendData.img = data.receiverImg;
  } else if (data.receiverId === currentUserData.uid) {
    friendData.name = data.senderName;
    friendData.id = data.senderId;
    friendData.img = data.senderImg;
  }

  const handleUnfriend = function () {
    if (confirm(`Do you want to unfriend ${friendData.name} ?`)) {
      remove(ref(db, "friends/" + data.id));
    }
  };

  const handleBlock = function () {
    if (confirm(`Do you want to block ${friendData.name} ?`)) {
      push(ref(db, "block/"), {
        blockedUserId: friendData.id,
        blockedUserName: friendData.name,
        blockedUserImg: friendData.img,
        blockedByUserId: currentUserData.uid,
        blockedByUserName: currentUserData.displayName,
      }).then(() => {
        remove(ref(db, "friends/" + data.id));
      });
    }
  };

  return (
    <div className="flex gap-x-4 overflow-hidden rounded-lg border border-white/30 min-[500px]:mx-20 sm:mx-0 sm:block">
      <picture>
        <img className="w-[125px] sm:w-full" src={friendData.img} alt="" />
      </picture>
      <div className="flex flex-col items-start gap-y-3 px-3 pb-5 pt-3 sm:items-stretch">
        <h4 className="text-center text-xl font-semibold">{friendData.name}</h4>
        <div className="flex gap-x-2 gap-y-2 sm:flex-col">
          <button
            className="block rounded-md bg-dark-200 px-4 py-2.5 text-lg font-medium leading-none duration-150 hover:bg-dark-100 sm:px-0"
            onClick={handleUnfriend}
          >
            Unfriend
          </button>
          <button
            className="block rounded-md bg-red-700 px-4 py-2.5 text-lg font-medium leading-none duration-150 hover:bg-red-800 sm:px-0"
            onClick={handleBlock}
          >
            Block
          </button>
        </div>
      </div>
    </div>
  );
}
