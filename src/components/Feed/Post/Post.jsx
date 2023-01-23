import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import s from "./Post.module.css";
import { BookmarkAdd, BookmarkRemove, Comment, DeleteForever, HourglassEmpty } from '@mui/icons-material/';
import {
    togglePostVisability as togglePostVisability_AC,
    fetchLikeDislike as fetchLikeDislike_AC,
    setAutorsAvatar as setAutorsAvatar_AC,
    deletePost as deletePost_AC,
    togglePostBookmark as togglePostBookmark_AC,
} from "../../../redux/feedSlice"
import { useSelector } from "react-redux";
import $api from "../../../http";


const Post = (props) => {

    //React-Redux
    const currentUser = useSelector((state) => state.auth.currentUser);
    const currentPost = useSelector((state) => state.feed["postsData_" + props.folder][props.index]);
    const loadingPosts = useSelector((state) => state.feed.loadingPosts);

    useEffect(() => {
        $api.get(`/users/get_one_avatar/${props.post.authorId}`) //$api - imported with settings 
            .then((res) => {
                return setAutorsAvatar(res.data)
            })
            .catch((err) => {
                return console.log("Error with fetching avatar IMG");
            })
    }, [])

    //Handlers
    const togglePostVisability = () => {
        props.dispatch(togglePostVisability_AC({
            postIndex: props.index,
            folder: props.folder
        }))
    }

    const setAutorsAvatar = (avatarImg) => {
        props.dispatch(setAutorsAvatar_AC({
            imgUrl: avatarImg,
            postIndex: props.index,
            folder: props.folder
        }))
    }

    const toggleLike = (e) => {
        const target = e.target.closest('div')
        props.dispatch(fetchLikeDislike_AC({
            folder: props.folder,
            postId: props.post._id,
            postIndex: props.index,
            userId: currentUser._id,
            emotion: target.dataset.name,
        }))
    }

    const handleDeletePost = (e) => {
        if (window.confirm("Вы уверены, что хотите удалить этот пост?")) {
            props.dispatch(deletePost_AC({
                folder: props.folder,
                postId: props.post._id,
                postIndex: props.index
            }))
        }
    }

    const handleTogglePostBookmark = () => {
        const postId = props.post._id
        const post = props.post
        const userId = currentUser._id
        const todo = isBookmarked ? "remove" : "add"
        props.dispatch(togglePostBookmark_AC({
            post: post,
            todo: todo,
            userId: userId
        }))
    }

    //Variables

    const isLoading = loadingPosts.includes(props.post._id)
    const isBookmarked = currentUser.favoritePosts.includes(props.post._id)
    const isLiked = props.post.likes.includes(currentUser._id)
    const isDisliked = props.post.dislikes.includes(currentUser._id)
    const isOwnPost = (props.post.authorId == currentUser._id)



    let avatarBgImg = { backgroundImage: 'url(/images/no_avatar.png)', };
    if (currentPost?.avatarImg && currentPost?.avatarImg.length > 5) {
        avatarBgImg = { backgroundImage: 'url(' + currentPost?.avatarImg + ')', };
    }

    let _date = new Date(props.post.createdAt);
    let options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    let date = _date.toLocaleDateString("ru-RU", options);

    let postContent = props.post.body.map((item) => {
        switch (item.type) {
            case "text":
                return (
                    <div className={s.textItem} key={"POSTITEM_" + Math.floor(Math.random() * 1000000)}>
                        {item.content}
                    </div>
                )

            case "img":
                return (
                    <img
                        className={s.imgItem}
                        key={"POSTITEM_" + Math.floor(Math.random() * 1000000)}
                        src={item.content}
                        alt="" />
                )
        }
    })

    //Render
    return (
        <div className={s.post}>

            {/* Likes display */}
            <div className={s.likesWrapper}>
                <div className={s.postlikes}>
                    <div data-name="like" className={isLiked ? s.likesIncrementActivated : s.likesIncrement}>
                        <svg className={s.arrow} viewBox="0 0 9 14">
                            <path onClick={toggleLike} d="M6.660,8.922 L6.660,8.922 L2.350,13.408 L0.503,11.486 L4.813,7.000 L0.503,2.515 L2.350,0.592 L8.507,7.000 L6.660,8.922 Z" />
                        </svg>
                    </div>
                    <div className={s.likesCount}>{isLoading ? <HourglassEmpty /> : props.post.likes.length - props.post.dislikes.length}</div>
                    <div data-name="dislike" className={isDisliked ? s.likesDecrementActivated : s.likesDecrement}>
                        <svg className={s.arrow} viewBox="0 0 9 14">
                            <path onClick={toggleLike} d="M6.660,8.922 L6.660,8.922 L2.350,13.408 L0.503,11.486 L4.813,7.000 L0.503,2.515 L2.350,0.592 L8.507,7.000 L6.660,8.922 Z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Post BODY */}
            <div className={s.postBody}>

                <div className={s.creationInfo}>
                    <Link className={s.authorItem} style={avatarBgImg} to={`/profile/${props.post.authorId}`} />
                    <div className={s.dateItem}> {date} </div>
                    <div className={s.titleItem}> {props.post.title} </div>
                    <div className={s.hidePost} onClick={togglePostVisability} >
                        {props.post.hidden ? "Раскрыть" : "Спрятать"}
                    </div>
                </div>

                <div
                    className={s.content + " " + (props.post.hidden ? s.hidden : "")}
                >
                    {postContent}
                </div>
                <div className={s.actions}>
                    {isBookmarked
                        ? < span className={s.actions__item} onClick={handleTogglePostBookmark}>
                            <BookmarkRemove className={s.icon} /> Убрать из закладок
                        </span>
                        : < span className={s.actions__item} onClick={handleTogglePostBookmark}>
                            <BookmarkAdd className={s.icon} /> Добавить в закладки
                        </span>
                    }
                    {isOwnPost
                        ? <span className={s.actions__item} onClick={handleDeletePost}>
                            <DeleteForever className={s.icon} />
                            Удалить пост
                        </span>
                        : ''}
                </div>
            </div>
        </div>
    )
}

export default Post;