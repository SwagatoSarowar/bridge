import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLoginInfo } from "../slices/userSlice";
import Navbar from "../components/Navbar";
import MainContainer from "../components/MainContainer";
import PostInputField from "../components/PostInputField";
import CreatePostModal from "../components/CreatePostModal";
import { getDatabase, onValue, ref } from "firebase/database";
import Posts from "../components/Posts";

export default function Home() {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUserData = useSelector((state) => state.user.userInfo);

  const [verified, setVerified] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const [friendsIdList, setFriendsIdList] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    !currentUserData && navigate("/login");
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setVerified(user?.emailVerified);
      dispatch(() => userLoginInfo(user));
      localStorage.setItem("userLoginInfo", JSON.stringify(user));
    });
  }, []);

  useEffect(() => {
    onValue(ref(db, "friends/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        tempArr.push(item.val().senderId + item.val().receiverId);
      });
      setFriendsIdList(tempArr);
    });
  }, [db]);

  useEffect(() => {
    onValue(ref(db, "posts/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        tempArr.push(item.val());
      });
      setPosts(tempArr);
    });
  }, [db]);

  useEffect(() => {
    const body = document.querySelector("body");

    if (showCreatePostModal) {
      document.documentElement.scrollTop = 0;
      body.style.overflowY = "hidden";
    } else {
      body.style.overflowY = "auto";
    }
  }, [showCreatePostModal]);

  return (
    <div>
      {verified ? (
        <div className="min-h-screen bg-dark-400 text-white">
          <Navbar />
          <div className="mt-3 sm:mt-5">
            <MainContainer>
              <div className="rounded-md bg-dark-300 p-5 shadow-[5px_5px_10px_0_rgba(0,0,0,0.2)]">
                <PostInputField
                  profileImg={currentUserData.photoURL}
                  onShowCreatePostModal={setShowCreatePostModal}
                />
              </div>
              <div className="mt-3 flex flex-col gap-y-3 sm:mt-5 sm:gap-y-5">
                {posts.map((item, index) => (
                  <Posts
                    key={index}
                    data={item}
                    friendsIdList={friendsIdList}
                  />
                ))}
              </div>
            </MainContainer>
          </div>
          {showCreatePostModal && (
            <CreatePostModal onShowCreatePostModal={setShowCreatePostModal} />
          )}
        </div>
      ) : (
        <VerifyModal onNavigate={navigate} />
      )}
    </div>
  );
}

function VerifyModal({ onNavigate }) {
  return (
    <div className="flex h-screen items-center justify-center bg-blue-300">
      <div className="flex flex-col items-center gap-y-8 rounded-lg bg-white p-3 shadow-2xl md:p-10">
        <h1 className="text-xl font-semibold text-blue-950 md:text-4xl">
          Please verify your email to login
        </h1>
        <button
          className="rounded-md bg-red-500 px-4 py-2 font-semibold text-white shadow-[5px_5px_10px_0_rgba(0,0,0,0.4)] duration-200 hover:-translate-y-[2px] hover:bg-red-600 hover:shadow-[7px_7px_14px_0_rgba(0,0,0,0.5)] md:text-lg"
          onClick={() => onNavigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
