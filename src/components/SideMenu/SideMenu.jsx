import React from "react";
import s from "./SideMenu.module.css";

import { logout as logout_AC } from "../../redux/authSlice"
import { ExitToApp, Person, Forum, Bookmark, People, FiberNew, ThumbUpAlt, RecentActors, Search } from '@mui/icons-material/';
import { Link, NavLink as BaseNavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeSearchString } from "../../redux/searchStringSlice";
import { toggleSideMenuOpen } from "../../redux/visualModeSlice";


const SideMenu = () => {

  //React-Redux
  const currentUser = useSelector((state) => state.auth.currentUser);
  const searchString = useSelector((state) => state.searchString.searchString)
  const sideMenuOpen = useSelector((state) => state.visualMode.sideMenuOpen)
  const dispatch = useDispatch();

  //Handlers
  const logout = () => {
    console.log("You have logged out");
    dispatch(toggleSideMenuOpen())
    dispatch(logout_AC())
  }

  const handleChangeSearchString = (e) => {
    dispatch(changeSearchString(e.target.value))
    document.dispatchEvent(new Event("feedIsOpened"))
    document.dispatchEvent(new Event("usersIsOpened"))
  }

  const handleToggleSideMenuOpen = () => {
    dispatch(toggleSideMenuOpen())
  }

  //Variables
  const currentUserPath = '/profile/' + currentUser._id;
  let avatarBgImg = { backgroundImage: 'url(/images/no_avatar.png)', };
  if (currentUser?.avatarImg && currentUser?.avatarImg.length > 5) {
    avatarBgImg = { backgroundImage: 'url(' + currentUser?.avatarImg + ')', };
  }

  //Render
  return (
    <div className={s.wrapper} style={sideMenuOpen
      ? { right: "0", width: "100%" }
      : { right: "-150%", }}>
      <div className={s.wrapper_content}>

        {/* DESKTOP MODE */}

        <div className={s.sideMenuBlock}>
          <div className={s.sideProfile}>
            <Link
              onClick={handleToggleSideMenuOpen}
              className={s.avatar}
              style={avatarBgImg}
              to={currentUserPath} />
            <div className={s.nikname}> {currentUser.username} </div>
            <div className={s.name}> {`${currentUser.familyName} ${currentUser.firstName}`} </div>
            <div className={s.raiting}> {`Рейтинг: ${currentUser.raiting}`} </div>
            <div className={s.exit}
              onClick={logout}
            >
              <ExitToApp className={s.icon} />
              Выйти
            </div>
          </div>
        </div>

        <nav className={s.sideMenuBlock + " " + s.mobile}>
          <NavLink
            to="/feed/fresh"
            onClick={handleToggleSideMenuOpen}
            className={s.item}
            activeClassName={s.active}>
            <FiberNew className={s.icon} />
            Свежее
          </NavLink>
          <NavLink
            to="/feed/best"
            onClick={handleToggleSideMenuOpen}
            className={s.item}
            activeClassName={s.active}>
            <ThumbUpAlt className={s.icon} />
            Лучшее
          </NavLink>
          <NavLink
            to="/users"
            onClick={handleToggleSideMenuOpen}
            className={s.item}
            activeClassName={s.active}>
            <People className={s.icon} />
            Пользователи
          </NavLink>
        </nav>

        <label className={s.headerSearchContainer  + " " + s.mobile}>
          <input
            className={s.searchInput}
            value={searchString}
            maxLength="20"
            onChange={handleChangeSearchString}
            type="text"
            placeholder="Введите название поста или юзера" />
          <Search className={s.icon} />
        </label>


        <NavLink
          to="/add"
          onClick={handleToggleSideMenuOpen}
          className={s.button}
          activeClassName={s.active}>
          Создать пост
        </NavLink>

        <nav className={s.sideMenuBlock}>

          <NavLink
            to={currentUserPath}
            onClick={handleToggleSideMenuOpen}
            className={s.item}
            activeClassName={s.active}>
            <Person className={s.icon} />
            Мой профиль
          </NavLink>

          {/* <NavLink
            to="/messenger"
            onClick={handleToggleSideMenuOpen}
            className={s.item}
            activeClassName={s.active}>
            <Forum className={s.icon} />
            Мои сообщения
          </NavLink> */}

          <NavLink
            to="/feed/favorities"
            onClick={handleToggleSideMenuOpen}
            className={s.item}
            activeClassName={s.active}>
            <Bookmark className={s.icon} />
            Мои любимиые посты
          </NavLink>

          <NavLink
            to="/feed/follows"
            onClick={handleToggleSideMenuOpen}
            className={s.item}
            activeClassName={s.active}>
            <RecentActors className={s.icon} />
            Посты по моим подпискам
          </NavLink>

        </nav>

      </div>
    </div>
  )
}

export default SideMenu;


// Сreating own <NavLink /> as a wrapper component (I prefer v5 API of React-Router-DOM):
const NavLink = React.forwardRef(
  ({ activeClassName, activeStyle, ...props }, ref) => {
    return (
      <BaseNavLink
        ref={ref}
        {...props}
        className={({ isActive }) =>
          [
            props.className,
            isActive ? activeClassName : null,
          ]
            .filter(Boolean)
            .join(" ")
        }
        style={({ isActive }) => ({
          ...props.style,
          ...(isActive ? activeStyle : null),
        })}
      />
    );
  }
);