import { Link, NavLink } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { MdGroups } from "react-icons/md";
import { useSelector } from "react-redux";

const navbarLinks = [
  { linkTo: "/", icon: <GoHomeFill />, tooltipTxt: "Home" },
  { linkTo: "/users", icon: <MdGroups />, tooltipTxt: "Users" },
];

export default function Navbar() {
  const currentUserData = useSelector((state) => state.user.userInfo);

  return (
    <div className="sticky left-0 top-0 border-b border-white/20 bg-dark-300">
      <div className="flex items-center justify-between px-4 text-white">
        {/* <picture>
      <img src="" alt="" />
    </picture> */}

        <div>logo</div>
        <ul className="flex gap-x-2 text-xl leading-none text-white md:text-2xl">
          {navbarLinks.map((item, index) => (
            <NavItem key={index} data={item} />
          ))}
        </ul>
        <div className="relative">
          <Link to="/profile" className="peer block">
            <picture>
              <img
                className="w-10 rounded-full md:w-12"
                src={currentUserData.photoURL}
                alt="profile image"
              />
            </picture>
          </Link>
          <p className="absolute left-1/2 top-[120%] -translate-x-1/2 rounded-xl bg-slate-200 px-4 py-[2px] text-sm text-black opacity-0 peer-hover:opacity-100 peer-hover:duration-500">
            Profile
          </p>
        </div>
      </div>
    </div>
  );
}

function NavItem({ data }) {
  return (
    <li className="relative">
      <NavLink
        className="peer block rounded-md px-6 py-3 hover:bg-dark-200 md:px-10 md:py-4"
        to={data.linkTo}
      >
        {data.icon}
      </NavLink>

      <p className="absolute left-1/2 top-[120%] -translate-x-1/2 rounded-xl bg-slate-200 px-4 py-[2px] text-sm text-black opacity-0 peer-hover:opacity-100 peer-hover:duration-500">
        {data.tooltipTxt}
      </p>
    </li>
  );
}
