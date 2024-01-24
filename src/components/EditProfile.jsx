import { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import ProfileNameEdit from "./ProfileNameEdit";
import ProfileImgEdit from "./ProfileImgEdit";
import CoverImgEdit from "./CoverImgEdit";

export default function EditProfile({
  profileImg,
  profileName,
  coverImg,
  onShowEditProfile,
}) {
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [showProfileImgEdit, setShowProfileImgEdit] = useState(false);
  const [showCoverImgEdit, setShowCoverImgEdit] = useState(false);

  return (
    <>
      <div className="absolute left-0 top-0 h-screen w-full overflow-y-scroll bg-black/70 backdrop-blur-sm">
        <div className="mx-auto my-6 rounded-md bg-dark-300  py-4 text-light-400 md:w-[700px]">
          <div className="relative border-b border-b-white/20 ">
            <h2 className="pb-3 pt-2 text-center text-xl font-semibold md:text-2xl">
              Edit Profile
            </h2>
            <button
              className="absolute right-10 top-[45%] -translate-y-1/2 rounded-full bg-dark-200 p-2 duration-150 hover:bg-dark-100 md:top-[40%] md:text-2xl"
              onClick={() => onShowEditProfile(false)}
            >
              <LiaTimesSolid />
            </button>
          </div>
          <div className="flex flex-col gap-y-6 px-4 py-4 text-lg font-medium md:gap-y-4 md:px-10 md:text-xl">
            <div>
              <div className="flex justify-between">
                <h3>Profile Name</h3>
                <EditButton onClick={() => setShowNameEdit(true)} />
              </div>
              <p className="text-center text-3xl">{profileName}</p>
            </div>
            <div>
              <div className="flex justify-between">
                <h3>Profile Picture</h3>
                <EditButton onClick={() => setShowProfileImgEdit(true)} />
              </div>
              <img
                className="mx-auto my-4 w-[100px] rounded-full md:my-8 md:w-[150px]"
                src={profileImg}
                alt="profile picture"
              />
            </div>
            <div>
              <div className="flex justify-between">
                <h3>Cover Photo</h3>
                <EditButton onClick={() => setShowCoverImgEdit(true)} />
              </div>
              <img
                className="mx-auto my-4 w-[500px] rounded-lg md:my-8"
                src={coverImg}
                alt="cover photo"
              />
            </div>
          </div>
        </div>
      </div>
      {showNameEdit && (
        <ProfileNameEdit
          profileName={profileName}
          onShowNameEdit={setShowNameEdit}
        />
      )}
      {showProfileImgEdit && (
        <ProfileImgEdit onShowProfileImgEdit={setShowProfileImgEdit} />
      )}
      {showCoverImgEdit && (
        <CoverImgEdit onShowCoverImgEdit={setShowCoverImgEdit} />
      )}
    </>
  );
}

function EditButton({ onClick }) {
  return (
    <button
      onClick={() => onClick()}
      className="rounded-md px-3 py-1 text-base font-normal text-green-400 duration-150 hover:bg-dark-200 md:text-lg"
    >
      Edit
    </button>
  );
}
