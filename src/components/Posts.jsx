import { getDatabase, ref, remove } from "firebase/database";
import { ImBin } from "react-icons/im";
import { useSelector } from "react-redux";
import moment from "moment";
import ModalImage from "react-modal-image";
import { useNavigate } from "react-router-dom";

function Posts({ data, deleteBtn = false, friendsIdList = null }) {
  const db = getDatabase();
  const navigate = useNavigate();

  const currentUserData = useSelector((state) => state.user.userInfo);

  const handleDeletePost = function () {
    if (confirm("The post will be permanently deleted. Are you sure ?")) {
      remove(ref(db, "posts/" + data.id));
    }
  };

  return (
    <>
      {!friendsIdList ||
      friendsIdList?.includes(currentUserData.uid + data.creatorId) ||
      friendsIdList?.includes(data.creatorId + currentUserData.uid) ? (
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
                  "a minute ago"
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
        </div>
      ) : null}
    </>
  );
}

export default Posts;
