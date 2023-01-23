import React, { useEffect } from "react";
import { useSelector, useDispatch} from "react-redux"
import { actionNames, initialState } from "../../redux/darkmodeReducer";

import s from "./Header.module.css";
import { Search, Notifications, Brightness3, Brightness7 } from '@mui/icons-material/';
import { Link, NavLink as BaseNavLink } from "react-router-dom";
import { toggleDarkmode } from "../../redux/darkmodeSlice";
import { changeSearchString as changeSearchString_AC } from "../../redux/searchStringSlice";



const Header = () => {

    const darkmode = useSelector((state) => state.darkmode.darkmode)
    const searchString = useSelector((state) => state.searchString.searchString)
    const dispatch = useDispatch()

    const toggleDarkMode = () => {
        dispatch(toggleDarkmode())
    }

    const handleChangeSearchString = (e) => {
        dispatch(changeSearchString_AC(e.target.value))
        document.dispatchEvent(new Event("feedIsOpened"))
        document.dispatchEvent(new Event("usersIsOpened"))
    }

    return (
        <header className={s.headerWrapper}>
            <div className={s.headerContainer}>
                <div className={s.headeLogoContainer}>
                    <Link className={s.logoName}  to="/feed/fresh">
                        <span className={s.charColor}>S</span>
                        TORY
                        <span className={s.charColor}>S</span>
                        ERF
                    </Link>
                </div>
                <div className={s.headeNavContainer}>
                    <NavLink
                        to="/feed/fresh"
                        className={s.navItem}
                        activeClassName={s.active}>
                        Свежее
                    </NavLink>
                    <NavLink
                        to="/feed/best"
                        className={s.navItem}
                        activeClassName={s.active}>
                        Лучшее
                    </NavLink>
                    <NavLink
                        to="/users"
                        className={s.navItem}
                        activeClassName={s.active}>
                        Пользователи
                    </NavLink>
                </div>
                <div className={s.headerProfile}>
                    <label className={s.headerSearchContainer}>
                        <input
                            className={s.searchInput}
                            value={searchString}
                            maxLength="20"
                            onChange={handleChangeSearchString}
                            type="text"
                            placeholder="Введите название поста или юзера" />
                        <Search className={s.icon} />
                    </label>
                    <div>
                        { darkmode
                            ? <Brightness3 className={s.icon} onClick = {toggleDarkMode}/> 
                            : <Brightness7 className={s.icon} onClick = {toggleDarkMode}/>}
                    </div>
                    {/* <div className={s.icon}>
                        <Notifications className={s.icon} />
                        <div className={s.notification}>5</div>
                    </div> */}
                </div>
            </div>
        </header >
    );
}

export default Header;

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