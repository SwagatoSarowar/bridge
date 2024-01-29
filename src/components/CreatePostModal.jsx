import { LiaTimesSolid } from "react-icons/lia";
import { GrGallery } from "react-icons/gr";
import { HiDocumentRemove } from "react-icons/hi";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref as sref,
  uploadString,
} from "firebase/storage";
import { getDatabase, push, ref } from "firebase/database";
import { useSelector } from "react-redux";

function CreatePostModal({ onShowCreatePostModal }) {
  const storage = getStorage();
  const db = getDatabase();

  const currentUserData = useSelector((state) => state.user.userInfo);

  const [selectedImg, setSelectedImg] = useState(null);
  const [status, setStatus] = useState("");

  const handleSelectedImage = function (e) {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImg(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = function (e) {
    e.preventDefault();

    if (!selectedImg && !status) return;

    if (!selectedImg) {
      push(ref(db, "posts/"), {
        status,
        creatorId: currentUserData.uid,
        creatorName: currentUserData.displayName,
        creatorImg: currentUserData.photoURL,
        time: `${new Date().getFullYear()} ${
          new Date().getMonth() + 1
        } ${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`,
      }).then(() => onShowCreatePostModal(false));
    } else {
      const uuid = uuidv4();
      uploadString(sref(storage, "postImg/" + uuid), selectedImg, "data_url")
        .then(() => {
          getDownloadURL(sref(storage, "postImg/" + uuid)).then(
            (downloadURL) => {
              push(ref(db, "posts/"), {
                postedImg: downloadURL,
                status,
                creatorId: currentUserData.uid,
                creatorName: currentUserData.displayName,
                creatorImg: currentUserData.photoURL,
                time: `${new Date().getFullYear()} ${
                  new Date().getMonth() + 1
                } ${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`,
              });
            },
          );
        })
        .then(() => onShowCreatePostModal(false));
    }
  };

  return (
    <div className="fixed left-0 top-0 flex h-screen w-full items-center justify-center overflow-y-scroll bg-black/70 backdrop-blur-sm">
      <div className="mx-auto max-h-screen overflow-x-auto rounded-md border border-white/20 bg-dark-400 py-5 md:w-[600px]">
        <div className="relative border-b border-white/20 pb-6 pt-2 text-white">
          <h3 className="text-center text-2xl font-medium">Create Post</h3>
          <button
            className="absolute right-10 top-[45%] -translate-y-1/2 rounded-full bg-dark-200 p-2 duration-150 hover:bg-dark-100 md:top-[40%] md:text-2xl"
            onClick={() => onShowCreatePostModal(false)}
          >
            <LiaTimesSolid />
          </button>
        </div>
        <form className="flex flex-col gap-y-5 px-8 py-6">
          <textarea
            rows={7}
            className="resize-none rounded-md bg-dark-200 px-3 py-2 text-xl text-white outline-none hover:bg-dark-100 focus-visible:bg-dark-100"
            type="text"
            placeholder="What's on your mind ?"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          {selectedImg && (
            <img
              className="m-auto w-[75%]"
              src={selectedImg}
              alt="selectd Image"
            />
          )}
          {selectedImg ? (
            <button
              className="flex items-center justify-center gap-x-3 rounded-md bg-white/15 px-3 py-2 font-medium text-white duration-150 hover:bg-white/10"
              onClick={() => setSelectedImg(null)}
            >
              <HiDocumentRemove size={18} /> Remove Image
            </button>
          ) : (
            <label className="flex cursor-pointer items-center justify-center gap-x-3 rounded-md bg-white/15 px-3 py-2 font-medium text-white duration-150 hover:bg-white/10">
              <GrGallery size={18} /> Add photo
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleSelectedImage(e)}
              />
            </label>
          )}

          <button
            type="submit"
            className="rounded-md bg-green-600 px-3 py-2 font-medium text-white duration-150 hover:bg-green-700"
            onClick={(e) => handleCreatePost(e)}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );

  /*   <label className="cursor-pointer p-1">
    <FaImages size={20} />
    <input className="hidden" type="file" onChange={(e) => handleSendImg(e)} />
  </label>; */
}

export default CreatePostModal;
