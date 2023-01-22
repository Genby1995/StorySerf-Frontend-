import React from "react";
import { NavLink as BaseNavLink } from "react-router-dom";
import s from "./DialogCompanion.module.css";

const DialogCompanion = (props) => {
    let path = '/messenger/'+ "id" + props.id;

    return (
      <div className={s.companion}>
        <NavLink to={path} activeClassName={s.active}>
          <div className={s.companionBlock}>
            <div className={s.companionAvatar} /*style={{backgroundImage: `url(${props.avatar})`}}*/ ></div>
            <div className={s.companionName}>{props.name}</div>
            <div className={s.companionLastMessage}>Давай, пока!</div>
            <div className={s.companionLastMessageTime}>12:51</div>
          </div>
        </NavLink>
      </div>
    )
}

export default DialogCompanion;

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