function MainContainer({ children, className }) {
  return (
    <div className={`mx-auto max-w-[1240px] ${className}`}>{children}</div>
  );
}

export default MainContainer;
