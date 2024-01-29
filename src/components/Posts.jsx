import { getDatabase, onValue, ref, remove, set } from "firebase/database";
import { ImBin } from "react-icons/im";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { useSelector } from "react-redux";
import moment from "moment";
import ModalImage from "react-modal-image";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentModal from "./CommentModal";

function Posts({ data, deleteBtn = false }) {
  const db = getDatabase();
  const navigate = useNavigate();

  const currentUserData = useSelector((state) => state.user.userInfo);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentsList, setCommentsList] = useState([]);

  const handleReact = function () {
    set(ref(db, "posts/" + data.id + "/reactions/" + currentUserData.uid), {
      reactorName: currentUserData.displayName,
    });
  };

  const handleRemoveReact = function () {
    remove(ref(db, "posts/" + data.id + "/reactions/" + currentUserData.uid));
  };

  const handleDeletePost = function () {
    if (confirm("The post will be permanently deleted. Are you sure ?")) {
      remove(ref(db, "posts/" + data.id));
    }
  };

  useEffect(() => {
    onValue(ref(db, "posts/" + data.id + "/comments/"), (snapshot) => {
      const tempArr = [];
      snapshot.forEach((item) => {
        tempArr.unshift(item.val());
      });
      setCommentsList(tempArr);
    });
  }, [db, data.id]);

  useEffect(() => {
    const body = document.querySelector("body");

    if (showCommentModal) {
      body.style.overflowY = "hidden";
    } else {
      body.style.overflowY = "auto";
    }
  }, [showCommentModal]);

  return (
    <>
      <div className="rounded-md bg-dark-300 px-3 py-8 shadow-[5px_5px_10px_0_rgba(0,0,0,0.2)] sm:px-16">
        <div className="flex items-center justify-between text-white">
          <div className="flex gap-x-5">
            <picture>
              <img
                className="w-10 cursor-pointer rounded-full sm:w-12"
                src={data?.creatorImg}
                alt="profile picture"
                onClick={() => navigate(`/${data.creatorId}`)}
              />
            </picture>
            <div>
              <h3
                className="cursor-pointer font-medium sm:text-lg"
                onClick={() => navigate(`/${data.creatorId}`)}
              >
                {data.creatorName}
              </h3>
              <p className="text-[10px] font-light sm:text-xs">
                {moment(data.time, "YYYY MM DD hour minutes").fromNow() ===
                  "a minute ago" ||
                moment(data.time, "YYYY MM DD hour minutes").fromNow() ===
                  "a few seconds ago"
                  ? "Just now"
                  : moment(data.time, "YYYY MM DD hour minutes").fromNow()}
              </p>
            </div>
          </div>
          {deleteBtn && (
            <button
              className="rounded-full p-3 duration-150 hover:bg-dark-200 sm:text-lg"
              onClick={handleDeletePost}
            >
              <ImBin />
            </button>
          )}
        </div>
        {data.postedImg ? (
          <div className="mx-2 sm:mx-4">
            <p className="mb-4 mt-8 text-white sm:text-lg">
              {data.status ? data.status : null}
            </p>
            <picture>
              <ModalImage
                className="w-full"
                small={data.postedImg}
                large={data.postedImg}
                alt="Posted Image"
              />
            </picture>
          </div>
        ) : (
          <p className="mx-2 mt-8 text-lg text-white sm:mx-4 sm:text-2xl">
            {data.status}
          </p>
        )}
        <div className="mx-2 mb-1 mt-4 flex h-5 justify-between text-xs font-light text-white sm:mx-5 sm:mb-2 sm:text-sm">
          <p>
            {data.reactions
              ? `${Object.keys(data.reactions).length} likes`
              : null}
          </p>
          <p
            className="cursor-pointer"
            onClick={() => setShowCommentModal(true)}
          >
            {commentsList.length ? `${commentsList.length} comments` : null}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 border-t border-white/20 pt-2 text-sm font-semibold text-light-400 sm:text-base md:text-lg [&>*]:flex [&>*]:grow [&>*]:items-center [&>*]:justify-center [&>*]:gap-x-4 [&>*]:rounded-md [&>*]:py-2 [&>*]:duration-150 hover:[&>*]:bg-dark-200/40">
          {data.reactions?.[currentUserData.uid] ? (
            <button className="text-green-500" onClick={handleRemoveReact}>
              <span className="text-lg sm:text-xl md:text-2xl">
                <FaHeart />
              </span>
              Love
            </button>
          ) : (
            <button onClick={handleReact}>
              <span className="text-lg sm:text-xl md:text-2xl">
                <FaRegHeart />
              </span>
              Love
            </button>
          )}
          <button onClick={() => setShowCommentModal(true)}>
            <span className="text-lg sm:text-xl md:text-2xl">
              <FaRegComment />
            </span>
            Comment
          </button>
        </div>
        {showCommentModal && (
          <CommentModal
            postData={data}
            commentData={commentsList}
            onShowCommentModal={setShowCommentModal}
          />
        )}
      </div>
    </>
  );
}

export default Posts;
