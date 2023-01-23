import React from "react";
import s from "./Users.module.css";
import axios, * as others from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
    fetchUsers as fetchUsers_AC,
    toggleFollowUser as toggleFollowUser_AC,
    setUsersSection as setUsersSection_AC,
} from "../../redux/usersSlice"

import {
    HourglassEmpty,
    SportsScore,
    Article,
    SpatialAudioOff,
    SpatialAudio, Grade,
    Notifications
} from "@mui/icons-material";
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { Link } from "react-router-dom";


const Users = (props) => {

    //React-Redux
    const dispatch = useDispatch();

    const status = useSelector((state) => state.users.status);
    const error = useSelector((state) => state.users.error);
    const usersData = useSelector((state) => state.users.usersData);
    const currentUser = useSelector((state) => state.auth.currentUser)
    const usersSection = useSelector((state) => state.users.usersSection)
    const searchString = useSelector((state) => state.searchString.searchString)

    useEffect(() => {
        document.addEventListener("scroll", scrollHandler)
        document.addEventListener("usersIsOpened", scrollHandler)
        document.dispatchEvent(new Event("usersIsOpened"))
        return function () {
            document.removeEventListener("scroll", scrollHandler)
            document.removeEventListener("usersIsOpened", scrollHandler)
        }
    }, [])

    //Variables

    let usersDataEdited = []
    if (usersData instanceof Array && usersData.length > 0) {
        usersDataEdited = [...usersData]
    }

    if (usersSection == "followings") {
        usersDataEdited = usersDataEdited.filter((item) => currentUser.followings.includes(item._id))
    } else if (usersSection == "followers") {
        usersDataEdited = usersDataEdited.filter((item) => currentUser.followers.includes(item._id))
    }

    if (searchString && typeof searchString == "string" && searchString.length > 0) {
        usersDataEdited = usersDataEdited.filter((item) => {
            return (
                item.firstName.toLowerCase().includes(searchString.toLowerCase())
                || item.familyName.toLowerCase().includes(searchString.toLowerCase())
                || item.username.toLowerCase().includes(searchString.toLowerCase())
            )
        })
    }

    //Handlers
    const scrollHandler = (e) => {
        const scrollHeight = e.target.documentElement.scrollHeight
        const scrollTop = e.target.documentElement.scrollTop
        const windowHeight = window.innerHeight
        if ((usersDataEdited.length < 1)
            || (scrollHeight - (scrollTop + windowHeight) < 100)) {
            fetchUsers();
        }
    }

    const fetchUsers = () => {
        dispatch(fetchUsers_AC())
    }

    const handleToggleSubscription = (e) => {
        const { userid, userindex, isfollowed } = e.target.dataset
        dispatch(toggleFollowUser_AC({
            action: (isfollowed == "true") ? "unfollow" : "follow",
            followingUserId: currentUser._id,
            followedUserId: userid,
            followedUserIdIndex: userindex
        }));
    }

    const handleSetUsersSection = (e) => {
        const { name } = e.target.dataset
        dispatch(setUsersSection_AC({ sectionName: name }));
        document.dispatchEvent(new Event("usersIsOpened"));
    }

    //Render
    return (
        <div className={s.wrapper}>
            <div className={s.content}>
                <div className={s.userSections}>
                
                    <span
                        onClick={handleSetUsersSection}
                        data-name="followers"
                        className={usersSection == "followers"
                            ? s.userSection + " " + s.current
                            : s.userSection}>
                        Мои подписчики
                    </span>
                    <span
                        onClick={handleSetUsersSection}
                        data-name="followings"
                        className={usersSection == "followings"
                            ? s.userSection + " " + s.current
                            : s.userSection}>
                        Мои подписки
                    </span>
                    <span
                        onClick={handleSetUsersSection}
                        data-name="all"
                        className={usersSection == "all"
                            ? s.userSection + " " + s.current
                            : s.userSection}>
                        Все пользователи
                    </span>

                </div>
                <div className={s.users}>
                    {usersDataEdited.map((user, index) => {
                        let avatarBgImg = { backgroundImage: 'url(/images/no_avatar.png)', };
                        if (user?.avatarImg && user?.avatarImg.length > 5) {
                            avatarBgImg = { backgroundImage: 'url(' + user?.avatarImg + ')', };
                        }
                        const isFollowed = currentUser.followings.includes(user._id)
                        return (
                            <div className={s.userBlock} key={user._id}>
                                <Link className={s.avatar} style={avatarBgImg} to={`/profile/${user._id}`} />
                                <div className={s.nikname}> {user.username} </div>
                                <div className={s.name}> {`${user.familyName} ${user.firstName}`} </div>
                                <div className={s.actions}>
                                    <button
                                        data-userid={user._id}
                                        data-userindex={index}
                                        data-isfollowed={isFollowed}
                                        name="edit"
                                        className={isFollowed
                                            ? s.actionButton + " " + s.followed
                                            : s.actionButton + " " + s.notFollowed}
                                        onClick={handleToggleSubscription}>
                                        {/* {isFollowed ? <NotificationsOffIcon /> : <NotificationAddIcon />} */}
                                        {isFollowed ? "Отписаться" : "Подписаться"}
                                    </button>
                                </div>
                                <div className={s.info}>
                                    <span className={s.icon}> <Article />: {user?.myPosts?.length}</span>
                                    <span className={s.icon}> <Grade />: {user?.raiting}</span>
                                    <span className={s.icon}> <Notifications />: {user?.followers?.length}</span>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
                {status == "loading"
                    ? <div className={s.message}>
                        <HourglassEmpty /> Загрузка</div>
                    : ''}
                {error == "No Content"
                    ? <div className={s.message}>
                        <SportsScore /> Все аккаунты загружены</div>
                    : ''}
            </div>
        </div >
    )
}

export default Users;