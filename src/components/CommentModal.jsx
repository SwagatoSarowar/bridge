import { LiaTimesSolid } from "react-icons/lia";
import { BsSendFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getDatabase, push, ref } from "firebase/database";
import moment from "moment";

function CommentModal({ postData, commentData, onShowCommentModal }) {
  const db = getDatabase();

  const [comment, setComment] = useState("");

  const currentUserData = useSelector((state) => state.user.userInfo);

  const handleAddComment = function (e) {
    e.preventDefault();

    if (!comment) return;

    push(ref(db, "posts/" + postData.id + "/comments/"), {
      commentorName: currentUserData.displayName,
      commentorId: currentUserData.uid,
      commentorImg: currentUserData.photoURL,
      comment,
      time: `${new Date().getFullYear()} ${
        new Date().getMonth() + 1
      } ${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`,
    }).then(() => setComment(""));
  };

  return (
    <div className="fixed left-0 top-0 flex h-screen w-full items-center justify-center overflow-y-scroll bg-black/70 backdrop-blur-sm">
      <div className="mx-auto my-6 rounded-md bg-dark-300  py-4 text-light-400 md:w-[700px]">
        <div className="relative border-b border-b-white/20 ">
          <h2 className="pb-3 pt-2 text-center text-xl font-semibold md:text-2xl">
            Comments
          </h2>
          <button
            className="absolute right-10 top-[45%] -translate-y-1/2 rounded-full bg-dark-200 p-2 duration-150 hover:bg-dark-100 md:top-[40%] md:text-2xl"
            onClick={() => onShowCommentModal(false)}
          >
            <LiaTimesSolid />
          </button>
        </div>
        <div className="flex flex-col gap-y-6 px-4 py-4 text-lg font-medium md:gap-y-4 md:px-10 md:text-xl">
          <div>
            {commentData.length ? (
              commentData.map((item, index) => (
                <Comment key={index} data={item} />
              ))
            ) : (
              <div className="py-10 text-center text-2xl font-bold text-white/30">
                No comments
              </div>
            )}
          </div>
          <div className="flex items-center gap-x-4">
            <img
              className="w-10 rounded-full"
              src={currentUserData.photoURL}
              alt=""
            />
            <form
              className="group flex w-full gap-x-2 rounded-md bg-dark-200 py-1 pl-2 pr-1 text-white sm:pl-3 sm:text-xl"
              onSubmit={handleAddComment}
            >
              <input
                className="w-full bg-transparent py-1 outline-none sm:py-2"
                type="text"
                placeholder="Write your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="rounded-md p-1 text-green-400 duration-150 hover:bg-dark-100 hover:text-green-500 sm:p-2.5">
                <BsSendFill />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;

function Comment({ data }) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-x-4">
        <img className="w-10 rounded-full" src={data.commentorImg} alt="" />
        <div>
          <h3 className="mb-1 leading-none">{data.commentorName}</h3>
          <p className="text-[8px] font-light leading-none sm:text-[10px]">
            {moment(data.time, "YYYY MM DD hour minutes").fromNow() ===
              "a minute ago" ||
            moment(data.time, "YYYY MM DD hour minutes").fromNow() ===
              "a few seconds ago"
              ? "Just now"
              : moment(data.time, "YYYY MM DD hour minutes").fromNow()}
          </p>
        </div>
      </div>
      <div className="my-3 ml-14 rounded-lg bg-dark-200 px-8 py-1.5">
        <p>{data.comment}</p>
      </div>
    </div>
  );
}
