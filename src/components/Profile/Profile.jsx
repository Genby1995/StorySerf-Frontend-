import React, { useEffect, useRef } from "react";
import Compressor from "compressorjs";
import s from "./Profile.module.css";
import Post from "../Feed/Post/Post";
import axios, * as others from 'axios';
import {
    Edit,
    Clear,
    Check,
    Notifications,
    NotificationsNone,
    NotificationsActive,
    DeleteForever,
    Delete,
    HourglassEmpty,
    NotificationAdd,
    NotificationsOff,
} from '@mui/icons-material/';

import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../redux/feedSlice";
import {
    changeInput as changeInput_AC,
    fetchUser as fetchUser_AC,
    updataUser as updataUser_AC,
    setIsCurrentlyEdited as setIsCurrentlyEdited_AC,
    uploadImg as uploadImg_AC,
    deleteAccount as deleteAccount_AC,
    toggleFollowUser as toggleFollowUser_AC
} from "../../redux/profileSlice";



const Profile = (params) => {

    let shouldFetch = useRef(true);

    const dispatch = useDispatch();
    const status = useSelector((state) => state.profile.status)
    const pathnameUserId = useSelector((state) => state.profile.pathnameUserId)
    const user = useSelector((state) => state.profile.user)
    const userEdit = useSelector((state) => state.profile.userEdit)
    const currentUser = useSelector((state) => state.auth.currentUser)
    const isCurrentlyEdited = useSelector((state) => state.profile.isCurrentlyEdited)
    const isOwnProfile = (pathnameUserId == currentUser._id)
    const isFollowed = currentUser.followings.includes(pathnameUserId)

    useEffect(() => {
        if (shouldFetch.current) {
            shouldFetch = false;
            getUser();
        }
    }, [pathnameUserId])

    const getUser = () => {
        dispatch(fetchUser_AC({ userId: pathnameUserId }))
    }

    const handleChange = (e) => {
        if (e.target.tagName == "TEXTAREA") {
            resizeTextArea(e)
        }
        dispatch(changeInput_AC({
            inputName: e.target.name,
            inputData: e.target.value
        }))
    }

    const handleChangeFileInput = (e) => {
        const file = e.target.files[0]
        new Compressor(file, {
            convertSize: e.target.name == "avatarImg" ? 150000 : 300000,
            quality: 0.6,
            maxHeight: e.target.name == "avatarImg" ? 640 : 1080,
            maxWidth: e.target.name == "avatarImg" ? 640 : 1920,
            success(result) {
                dispatch(uploadImg_AC({
                    inputName: e.target.name,
                    file: result
                }))
            },
            error(err) {
                console.log(err.message);
            },
        })
    }

    const handleSubmitChanges = (e) => {
        dispatch(updataUser_AC())
    }

    const handleDeleteAccount = (e) => {
        if (window.confirm("Вы уверены, что хотите удалить этот аккаунт?")) {
            dispatch(deleteAccount_AC({
                userId: pathnameUserId,
            }))
        }
    }

    const handleToggleSubscription = () => {
        dispatch(toggleFollowUser_AC({
            action: isFollowed ? "unfollow" : "follow",
            followingUserId: currentUser._id,
            followedUserId: pathnameUserId,
        }));
    }

    const handleSetCurrentActivity = (e) => {
        const activity = (e.target.name == "edit") ? true : false
        dispatch(setIsCurrentlyEdited_AC(activity))
    }

    //Handlers without Dispatches
    const resizeTextArea = (e) => {
        var el = e.target;
        setTimeout(function () {
            el.style.cssText = 0;
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
        }, 1);
    }

    //VARIABLES
    let avatarBgImg = { backgroundImage: 'url(/images/no_avatar.png)', };
    if (userEdit?.avatarImg && userEdit?.avatarImg.length > 5) {
        avatarBgImg = { backgroundImage: 'url(' + userEdit?.avatarImg + ')', };
    } else if (user?.avatarImg && userEdit?.avatarImg.length > 5) {
        avatarBgImg = { backgroundImage: 'url(' + user?.avatarImg + ')', };
    }

    let coverBgImg = { background: "linear-gradient(225deg, var(--color-char), var(--color-bkg))", };
    if (userEdit?.coverImg && userEdit?.coverImg.length > 5) {
        coverBgImg = { backgroundImage: 'url(' + userEdit?.coverImg + ')', };
    } else if (user?.coverImg && userEdit?.coverImg.length > 5) {
        coverBgImg = { backgroundImage: 'url(' + user?.coverImg + ')', };
    }

    let about = null//RETURNING "ABOUT"
    let actions = null //RETURNING ACTION BUTTONS

    if (isOwnProfile && isCurrentlyEdited) { // EDITIN OWN PROFILE
        actions =
            <div className={s.dscrActions}>
                <button
                    name="submit"
                    onClick={handleSubmitChanges}
                    className={s.actionButton}>
                    <Check /> Подтвердить изменения
                </button>
                <button
                    name="deny"
                    className={s.actionButton}
                    onClick={handleSetCurrentActivity}>
                    <Clear /> Отменить изменения
                </button>
                <button
                    name="delete"
                    className={s.actionButton}
                    onClick={handleDeleteAccount}>
                    <Delete /> Удалить профиль
                </button>
            </div>
        about =
            <div className={s.dscrAbout}>
                <h1>О себе:</h1>
                <textarea
                    name="about"
                    className={s.textItem}
                    value={userEdit?.about}
                    onChange={handleChange}
                    onFocus={resizeTextArea}
                    maxLength="3000" />
            </div>

    } else if (isOwnProfile && !isCurrentlyEdited) { // VISITING OWN PROFILE
        actions =
            <div className={s.dscrActions}>
                <button
                    name="edit"
                    className={s.actionButton}
                    onClick={handleSetCurrentActivity}>
                    <Edit /> Редактировать
                </button>
            </div>
        about =
            <div className={s.dscrAbout} >
                <h1>О себе:</h1>
                <p> {(user?.about && user?.about !== "") ? user?.about : "Пока тут ничего нет..."} </p>
            </div>

    } else { // VISITING PROFILE OF ANOTHER USER
        actions =
            <div className={s.dscrActions}>
                <button
                    name="edit"
                    className={s.actionButton}
                    onClick={handleToggleSubscription}>
                    {isFollowed ? <NotificationsOff /> : <NotificationAdd />}
                    {isFollowed ? "Отписаться" : "Подписаться"}
                </button>
            </div>
        about =
            <div className={s.dscrAbout}>
                <h1>О себе:</h1>
                <p> {(user?.about && user?.about !== "") ? user?.about : "Пока тут ничего нет..."} </p>
            </div>
    }


    return (

        <div className={s.wrapper}>

            {(status == "loading")
                ? <span className={s.veil}><HourglassEmpty /> Загрузка</span>
                : ""}

            {/* PROFILE */}
            <div className={s.profContainer}>
                <div className={s.profWallPaper} style={coverBgImg}>
                    {isCurrentlyEdited
                        ? <label className={s.profWallPaperChange}>
                            Изменить фон
                            <input
                                onChange={handleChangeFileInput}
                                name="coverImg"
                                type="file"
                                accept="image/*, .jpg, .jpeg, .png, .gif, .web"
                                hidden />
                        </label>
                        : ""}

                </div>

                <div className={s.profDscr}>

                    <div className={s.avatarContainer}>
                        <div className={s.avatar} style={avatarBgImg}>
                            {isCurrentlyEdited
                                ? <label className={s.avatarChange}>
                                    Изменить
                                    <input
                                        onChange={handleChangeFileInput}
                                        name="avatarImg"
                                        type="file"
                                        accept="image/*, .jpg, .jpeg, .png, .gif, .web"
                                        hidden />
                                </label>
                                : ""}
                        </div>
                    </div>

                    <div className={s.dscrBasic}>
                        <h1>
                            {(user?.username && user?.username !== "") ? user?.username : "Пока тут ничего нет...почему-то..."}
                        </h1>

                        {
                            (isOwnProfile && isCurrentlyEdited)
                                ? <h2>
                                    <input
                                        name="firstName"
                                        className={s.textItem}
                                        value={userEdit?.firstName}
                                        onChange={handleChange}
                                        maxLength="30"
                                        placeholder="Имя" />
                                    <input
                                        name="familyName"
                                        className={s.textItem}
                                        value={userEdit?.familyName}
                                        onChange={handleChange}
                                        maxLength="30"
                                        placeholder="Фамилия" />
                                </h2>
                                : <h2>{(!user?.firstName && !user?.familyName) ? " Потльзователь пока не представился" : ` ${user?.firstName} ${user?.familyName}`}</h2>
                        }

                    </div>

                    {//RETURNING ACTION BUTTONS
                        actions}


                    { // RETURNING "ABOUT"
                        about}

                    <div className={s.dscrStat}>
                        <div>Посты: <b>{user?.myPosts?.length}</b></div>
                        <div>Рейтинг: <b>{user?.raiting}</b></div>
                        <div>Подписчики: <b >{user?.followers?.length}</b></div>
                        <div>Подписки: <b >{user?.followings?.length}</b></div>
                    </div>

                </div>

            </div>
        </div >
    )
}

export default Profile;