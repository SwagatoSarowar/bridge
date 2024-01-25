import { useState } from "react";
import { userLoginInfo } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database";

function ProfileNameEdit({ profileName, onShowNameEdit }) {
  const db = getDatabase();
  const auth = getAuth();
  const dispatch = useDispatch();
  const currentUserData = useSelector((state) => state.user.userInfo);

  const [nameInput, setNameInput] = useState(profileName);

  const handleUpdateName = function (e) {
    e.preventDefault();

    if (!nameInput) return;

    updateProfile(auth.currentUser, {
      displayName: nameInput,
    })
      .then(() =>
        update(ref(db, "users/" + currentUserData.uid), {
          username: nameInput,
        }),
      )
      .then(() => {
        dispatch(userLoginInfo({ ...currentUserData, displayName: nameInput }));
        localStorage.setItem(
          "userLoginInfo",
          JSON.stringify({ ...currentUserData, displayName: nameInput }),
        );
        onShowNameEdit(false);
      });
  };
  return (
    <div className="absolute left-0 top-0 flex h-screen w-full items-center justify-center overflow-y-scroll bg-black/70 backdrop-blur-sm">
      <div className="flex justify-center rounded-md bg-dark-400 px-3 py-5 md:w-[600px]">
        <form>
          <input
            className="rounded-md bg-dark-200 px-3 py-2 text-xl text-white outline-none hover:bg-dark-100 focus-visible:bg-dark-100 md:w-[350px]"
            type="text"
            placeholder="Enter your Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <div className="mt-4 flex gap-x-2 font-medium text-white [&>*]:grow [&>*]:rounded-md [&>*]:px-3 [&>*]:py-2 [&>*]:duration-150">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              onClick={(e) => handleUpdateName(e)}
            >
              Update
            </button>
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => onShowNameEdit(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileNameEdit;
