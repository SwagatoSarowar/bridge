function PostInputField({ profileImg, onShowCreatePostModal }) {
  return (
    <div className="flex items-center justify-center gap-x-5">
      <picture>
        <img className="w-12 rounded-full sm:w-16" src={profileImg} alt="" />
      </picture>
      <button
        className="rounded-full bg-dark-200 px-8 py-3 text-sm text-white/60 duration-150 hover:bg-dark-100 sm:px-16 sm:text-lg md:px-32"
        onClick={() => onShowCreatePostModal(true)}
      >
        Share your thoughts ...
      </button>
    </div>
  );
}

export default PostInputField;
