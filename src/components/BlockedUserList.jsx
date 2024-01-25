import { getDatabase, onValue, ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function BlockedUserList() {
  const db = getDatabase();

  const currentUserData = useSelector((state) => state.user.userInfo);

  const [blockedUserList, setBlockedUserList] = useState([]);

  useEffect(() => {
    onValue(ref(db, "block/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        currentUserData.uid === item.val().blockedByUserId &&
          tempArr.push({ ...item.val(), id: item.key });
      });
      setBlockedUserList(tempArr);
    });
  }, [db, currentUserData.uid]);

  return (
    <div>
      {blockedUserList.length ? (
        <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {blockedUserList.map((item, index) => (
            <BlockedUser key={index} data={item} />
          ))}
        </div>
      ) : (
        <div className="pt-20 text-center text-xl font-medium text-white/20 md:text-2xl">
          No user is blocked currently
        </div>
      )}
    </div>
  );
}

function BlockedUser({ data }) {
  const db = getDatabase();

  const handleUnblock = function () {
    confirm(`Do you want to unblock ${data.blockedUserName}`) &&
      remove(ref(db, "block/" + data.id));
  };

  return (
    <div className="flex gap-x-4 overflow-hidden rounded-lg border border-white/30 min-[500px]:mx-20 sm:mx-0 sm:block">
      <picture>
        <img className="w-[125px] sm:w-full" src={data.blockedUserImg} alt="" />
      </picture>
      <div className="flex flex-col items-start gap-y-3 px-3 pb-5 pt-3 sm:items-stretch">
        <h4 className="text-center text-xl font-semibold">
          {data.blockedUserName}
        </h4>
        <div className="flex gap-x-2 gap-y-2 sm:flex-col">
          <button
            className="block rounded-md bg-red-700 px-4 py-2.5 text-lg font-medium leading-none duration-150 hover:bg-red-800 sm:px-0"
            onClick={handleUnblock}
          >
            Unblock
          </button>
        </div>
      </div>
    </div>
  );
}
