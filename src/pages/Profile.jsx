import { useDispatch, useSelector } from "react-redux";
import MainContainer from "../components/MainContainer";
import { MdEdit } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import ImgLoader from "../components/ImgLoader";
import { userLoginInfo } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";
import EditProfile from "../components/EditProfile";
import PostInputField from "../components/PostInputField";
import CreatePostModal from "../components/CreatePostModal";
import Posts from "../components/Posts";

function Profile() {
  const db = getDatabase();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUserData = useSelector((state) => state.user.userInfo);

  const [coverImg, setCoverImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  const handleLogout = function () {
    if (confirm("Do you want to log out ?")) {
      localStorage.removeItem("userLoginInfo");
      dispatch(userLoginInfo(null));
      navigate("/login");
    }
  };

  useEffect(() => {
    !currentUserData && navigate("/login");
  });

  useEffect(() => {
    setIsLoading(true);
    onValue(ref(db, "users/" + currentUserData?.uid), (snapshot) => {
      setCoverImg(snapshot.val().coverImg);
      setIsLoading(false);
    });
  }, [currentUserData, db]);

  useEffect(() => {
    onValue(ref(db, "posts/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        currentUserData?.uid === item.val().creatorId &&
          tempArr.push({ ...item.val(), id: item.key });
      });
      setUserPosts(tempArr);
    });
  }, [db, currentUserData]);

  useEffect(() => {
    const body = document.querySelector("body");

    if (showEditProfile || showCreatePostModal) {
      document.documentElement.scrollTop = 0;
      body.style.overflowY = "hidden";
    } else {
      body.style.overflowY = "auto";
    }
  }, [showEditProfile, showCreatePostModal]);

  return (
    <>
      {currentUserData && (
        <div className="min-h-screen bg-dark-400 pb-20">
          <Navbar />
          <div className="bg-dark-300">
            <MainContainer>
              <div className="aspect-[2.5] overflow-hidden rounded-bl-xl rounded-br-xl bg-dark-200">
                {isLoading ? (
                  <ImgLoader />
                ) : (
                  <picture>
                    <img className="w-full" src={coverImg} alt="" />
                  </picture>
                )}
              </div>
              <div className="mx-4 gap-x-4 md:mx-16 md:flex lg:gap-x-8">
                <div className="mb-[-2.75rem] flex -translate-y-[calc(50%-1rem)] justify-center">
                  <picture>
                    <img
                      className="aspect-square w-[125px] rounded-full border-4 border-dark-300 bg-slate-700 md:w-[175px]"
                      src={currentUserData.photoURL}
                      alt="profile-img"
                    />
                  </picture>
                </div>
                <div className="mb-8 flex flex-col gap-y-6 text-center md:hidden">
                  <div>
                    <h2 className="text-2xl text-white">
                      {currentUserData.displayName}
                    </h2>
                    <p className="text-slate-200">500 friends</p>
                  </div>
                  <div className="mb-4 flex gap-x-2 self-center">
                    <button
                      className="flex items-center gap-x-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white duration-150 hover:bg-green-700"
                      onClick={() => setShowEditProfile(true)}
                    >
                      <MdEdit />
                      Edit profile
                    </button>
                    <button
                      className="flex items-center gap-x-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white duration-150 hover:bg-red-700"
                      onClick={handleLogout}
                    >
                      <FaPowerOff />
                      Log Out
                    </button>
                  </div>
                </div>
                <div className="mt-3 hidden w-full justify-between md:flex">
                  <div>
                    <h2 className="text-3xl text-white lg:text-5xl">
                      {currentUserData.displayName}
                    </h2>
                    <p className="text-lg text-slate-200">500 friends</p>
                  </div>
                  <div className="mb-4 flex gap-x-4 self-center">
                    <button
                      className="flex items-center gap-x-1 rounded-lg bg-green-600 px-4 py-2 text-lg font-semibold text-white duration-150 hover:bg-green-700"
                      onClick={() => setShowEditProfile(true)}
                    >
                      <MdEdit />
                      Edit profile
                    </button>
                    <button
                      className="flex items-center gap-x-1 rounded-lg bg-red-600 px-4 py-2 text-lg font-semibold text-white duration-150 hover:bg-red-700"
                      onClick={handleLogout}
                    >
                      <FaPowerOff />
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </MainContainer>
          </div>
          <div className="mt-3 sm:mt-5">
            <MainContainer>
              <div className="rounded-md bg-dark-300 p-5 shadow-[5px_5px_10px_0_rgba(0,0,0,0.2)]">
                <PostInputField
                  profileImg={currentUserData.photoURL}
                  onShowCreatePostModal={setShowCreatePostModal}
                />
              </div>
              <div className="mt-3 flex flex-col gap-y-3 sm:mt-5 sm:gap-y-5">
                {userPosts.map((item, index) => (
                  <Posts key={index} data={item} deleteBtn={true} />
                ))}
              </div>
            </MainContainer>
          </div>
          {showEditProfile && (
            <EditProfile
              profileImg={currentUserData.photoURL}
              profileName={currentUserData.displayName}
              coverImg={coverImg}
              onShowEditProfile={setShowEditProfile}
            />
          )}
          {showCreatePostModal && (
            <CreatePostModal onShowCreatePostModal={setShowCreatePostModal} />
          )}
        </div>
      )}
    </>
  );
}

export default Profile;
