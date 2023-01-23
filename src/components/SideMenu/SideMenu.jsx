import React from "react";
import s from "./SideMenu.module.css";

import { logout as logout_AC } from "../../redux/authSlice"
import { ExitToApp, Person, Forum, Bookmark, People } from '@mui/icons-material/';
import { Link, NavLink as BaseNavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


const SideMenu = () => {

  //React-Redux
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();

  //Handlers
  const logout = () => {
    console.log("You have logged out");
    dispatch(logout_AC())
  }
  //Variables
  const currentUserPath = '/profile/' + currentUser._id;
  let avatarBgImg = { backgroundImage: 'url(/images/no_avatar.png)', };
  if (currentUser?.avatarImg && currentUser?.avatarImg.length > 5) {
    avatarBgImg = { backgroundImage: 'url(' + currentUser?.avatarImg + ')', };
  }

  //Render
  return (

    <div className={s.wrapper}>

      <div className={s.sideMenuBlock}>
        <div className={s.sideProfile}>
          <Link className={s.avatar} style={avatarBgImg} to={currentUserPath} />
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


      <NavLink
        to="/add"
        className={s.button}
        activeClassName={s.active}>
        Создать пост
      </NavLink>

      <div className={s.sticy}>
        <nav className={s.sideMenuBlock}>

          <NavLink
            to={currentUserPath}
            className={s.item}
            activeClassName={s.active}>
            <Person className={s.icon} />
            Мой профиль
          </NavLink>

          <NavLink
            to="/messenger"
            className={s.item}
            activeClassName={s.active}>
            <Forum className={s.icon} />
            Мои сообщения
          </NavLink>

          <NavLink
            to="/feed/favorities"
            className={s.item}
            activeClassName={s.active}>
            <Bookmark className={s.icon} />
            Мои любимиые посты
          </NavLink>

          <NavLink
            to="/feed/follows"
            className={s.item}
            activeClassName={s.active}>
            <People className={s.icon} />
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