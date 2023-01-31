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
        year: "2-digit",
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
    // SVG VARs
    let svg_like = "M210.323,17.93h-17.898c-9.01,0-16.066-5.165-26.848-8.949 c-14.766-5.116-36.821-8.956-74.811-8.956C84.122,0.025,63.516,0,63.516,0c-6.309,0-11.377,2.882-15.035,6.363 c-1.392,1.323-2.844,3.245-3.465,6.994c-0.101,0.582-0.21,3.017-0.193,3.346c-0.478,10.729,6.008,14.614,9.682,15.835 c-0.101,0.034-0.033,0.126-0.235,0.117l-11.662-0.522c-10.352-0.472-20.572,6.986-20.572,19.669 c0,10.517,8.524,17.933,18.844,18.439l-6.184-0.287c-10.352-0.455-19.103,7.695-19.582,18.22 c-0.453,10.526,7.567,19.433,17.913,19.906c-10.345-0.472-19.121,7.677-19.573,18.203c-0.454,10.526,6.821,19.99,17.174,20.444 l68.73,8.63c0,0-14.324,23.959-14.324,59.455c0,23.664,16.905,26.848,26.848,26.848c7.821,0.002,9.927-15.151,9.927-15.151h0.016 c1.77-9.717,4.077-18.203,12.091-33.827c8.968-17.512,21.184-15.869,35.446-31.467c2.517-2.747,5.898-7.281,9.195-12.86 c0.269-0.295,0.521-0.708,0.764-1.289c0.293-0.69,0.646-1.172,0.956-1.812c0.545-1.003,1.082-2.005,1.61-3.059 c8.826-8.827,22.579-7.925,28.435-7.925c11.746,0,17.898-6.825,17.898-17.898l0.005-81.828 C228.227,22.121,223.143,17.93,210.323,17.93z"

    //Render
    return (
        <div className={s.post}>

            {/* Likes display */}
            <div className={s.likesWrapper}>
                <div className={s.postlikesOutside}>
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
                    <div className={s.postlikesInside}>
                        <div data-name="like" className={isLiked ? s.likesIncrementActivated : s.likesIncrement}>
                            <svg className={s.arrow} viewBox="0 0 241.66 241.66">
                                <path style={{ strokeWidth: "5px"}} onClick={toggleLike} d={svg_like} />
                            </svg>
                        </div>
                        <div className={s.likesCount}>{isLoading ? <HourglassEmpty /> : props.post.likes.length - props.post.dislikes.length}</div>
                        <div data-name="dislike" className={isDisliked ? s.likesDecrementActivated : s.likesDecrement}>
                            <svg className={s.arrow} viewBox="0 0 241.66 241.66">
                                <path style={{ strokeWidth: "5px"}} onClick={toggleLike} d={svg_like} />
                            </svg>
                        </div>
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
        </div >
    )
}

export default Post;

