import { useDispatch, useSelector } from "react-redux";
import MainContainer from "../components/MainContainer";
import { MdEdit } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import ImgLoader from "../components/ImgLoader";
import { userLoginInfo } from "../slices/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import EditProfile from "../components/EditProfile";
import PostInputField from "../components/PostInputField";
import CreatePostModal from "../components/CreatePostModal";
import Posts from "../components/Posts";
import ModalImage from "react-modal-image";

function Profile() {
  const db = getDatabase();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const currentUserData = useSelector((state) => state.user.userInfo);

  const [isLoading, setIsLoading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const [userData, setUserData] = useState([]);
  const [friendsCount, setFriendsCount] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  const handleLogout = function () {
    if (confirm("Do you want to log out ?")) {
      localStorage.removeItem("bridgeAppUserLoginInfo");
      dispatch(userLoginInfo(null));
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!currentUserData) {
      navigate("/login");
    } else {
      onValue(ref(db, "users/"), (snapshot) => {
        !Object.keys(snapshot.val()).includes(userId) &&
          navigate("/error-page");
      });
    }
  });

  useEffect(() => {
    setIsLoading(true);
    onValue(ref(db, "users/" + userId), (snapshot) => {
      setUserData(snapshot.val());
      setIsLoading(false);
    });
  }, [userId, db]);

  useEffect(() => {
    onValue(ref(db, "friends/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        (userId === item.val().receiverId || userId === item.val().senderId) &&
          tempArr.push(item.val());
      });
      setFriendsCount(tempArr.length);
    });
  });

  useEffect(() => {
    onValue(ref(db, "posts/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        userId === item.val().creatorId &&
          tempArr.unshift({ ...item.val(), id: item.key });
      });
      setUserPosts(tempArr);
    });
  }, [db, userId]);

  useEffect(() => {
    const body = document.querySelector("body");

    if (showEditProfile || showCreatePostModal) {
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
          <div className="bg-gradient-to-b from-green-950 to-dark-300">
            <MainContainer>
              <div className="aspect-[2.5] overflow-hidden rounded-bl-xl rounded-br-xl bg-dark-200">
                {isLoading ? (
                  <ImgLoader />
                ) : (
                  <picture>
                    <ModalImage
                      className="w-full"
                      small={userData?.coverImg}
                      large={userData?.coverImg}
                      alt="Cover Image"
                    />
                  </picture>
                )}
              </div>
              <div className="mx-4 gap-x-4 md:mx-16 md:flex lg:gap-x-8">
                <div className="mb-[-2.75rem] flex -translate-y-[calc(50%-1rem)] justify-center">
                  <picture>
                    <img
                      className="aspect-square w-[125px] rounded-full border-4 border-dark-300 bg-slate-700 outline outline-4 outline-green-500 md:w-[175px]"
                      src={userData?.profileImg}
                      alt="profile-img"
                    />
                  </picture>
                </div>
                <div className="mb-8 mt-4 flex flex-col gap-y-6 pb-6 text-center md:hidden">
                  <div>
                    <h2 className="mb-2 text-2xl font-medium text-white">
                      {userData?.username}
                    </h2>
                    <p className="text-slate-200">
                      {friendsCount < 2
                        ? `${friendsCount} friend`
                        : `${friendsCount} friends`}
                    </p>
                  </div>
                  {currentUserData.uid === userId && (
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
                  )}
                </div>
                <div className="mt-3 hidden w-full justify-between pb-8 md:flex">
                  <div>
                    <h2 className="text-3xl font-semibold text-white lg:text-5xl">
                      {userData.username}
                    </h2>
                    <p className="text-lg text-slate-200">
                      {friendsCount < 2
                        ? `${friendsCount} friend`
                        : `${friendsCount} friends`}
                    </p>
                  </div>
                  {currentUserData.uid === userId && (
                    <div className="flex gap-x-4 self-center">
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
                  )}
                </div>
              </div>
            </MainContainer>
          </div>
          <div className="mt-3 sm:mt-5">
            <MainContainer>
              {currentUserData.uid === userId && (
                <div className="rounded-md bg-dark-300 p-5 shadow-[5px_5px_10px_0_rgba(0,0,0,0.2)]">
                  <PostInputField
                    profileImg={userData?.profileImg}
                    onShowCreatePostModal={setShowCreatePostModal}
                  />
                </div>
              )}

              <div className="mt-3 flex flex-col gap-y-3 sm:mt-5 sm:gap-y-5">
                {userPosts.map((item, index) => (
                  <Posts
                    key={index}
                    data={item}
                    deleteBtn={
                      currentUserData.uid === item.creatorId ? true : false
                    }
                  />
                ))}
              </div>
            </MainContainer>
          </div>
          {showEditProfile && (
            <EditProfile
              profileImg={currentUserData.photoURL}
              profileName={currentUserData.displayName}
              coverImg={userData?.coverImg}
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
