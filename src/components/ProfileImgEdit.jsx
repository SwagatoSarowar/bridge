import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { createRef, useState } from "react";
import {
  uploadString,
  ref,
  getStorage,
  getDownloadURL,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
import { update, ref as dref, getDatabase } from "firebase/database";
import { userLoginInfo } from "../slices/userSlice";

function ProfileImgEdit({ onShowProfileImgEdit }) {
  const storage = getStorage();
  const cropperRef = createRef();
  const auth = getAuth();
  const db = getDatabase();
  const dispatch = useDispatch();

  const currentUserData = useSelector((state) => state.user.userInfo);

  const [image, setImage] = useState("");

  const handleChange = function (e) {
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleUpdateProfileImg = function (e) {
    e.preventDefault();

    if (typeof cropperRef.current?.cropper !== "undefined") {
      const message = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      uploadString(
        ref(storage, "profileImg/" + currentUserData.uid),
        message,
        "data_url",
      ).then(() => {
        getDownloadURL(ref(storage, "profileImg/" + currentUserData.uid)).then(
          (downloadURL) => {
            updateProfile(auth.currentUser, {
              photoURL: downloadURL,
            }).then(() =>
              update(dref(db, "users/" + currentUserData.uid), {
                profileImg: downloadURL,
              }).then(() => {
                dispatch(
                  userLoginInfo({
                    ...currentUserData,
                    photoURL: downloadURL,
                  }),
                );
                localStorage.setItem(
                  "userLoginInfo",
                  JSON.stringify({
                    ...currentUserData,
                    photoURL: downloadURL,
                  }),
                );
                onShowProfileImgEdit(false);
              }),
            );
          },
        );
      });
    }
  };

  return (
    <div className="absolute left-0 top-0 flex h-screen w-full items-center justify-center overflow-y-scroll bg-black/70 backdrop-blur-sm">
      <div className="flex justify-center rounded-md bg-dark-400 px-3 py-5 md:w-[600px]">
        <form className="flex flex-col gap-y-4">
          {image && (
            <Cropper
              ref={cropperRef}
              style={{ height: 300, width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              aspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              guides={true}
            />
          )}
          <input
            className="w-[300px] rounded-md bg-dark-200 px-3 py-2 text-xl text-white outline-none hover:bg-dark-100 focus-visible:bg-dark-100 md:w-[350px]"
            type="file"
            onChange={(e) => handleChange(e)}
          />
          <div className="mt-4 flex gap-x-2 font-medium text-white [&>*]:grow [&>*]:rounded-md [&>*]:px-3 [&>*]:py-2 [&>*]:duration-150">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleUpdateProfileImg}
            >
              Update
            </button>
            <button
              type="button"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => onShowProfileImgEdit(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileImgEdit;
