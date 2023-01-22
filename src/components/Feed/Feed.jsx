import React from "react";
import s from "./Feed.module.css";
import Post from "./Post/Post";
import axios, * as others from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { fetchPosts, setPosts } from "../../redux/feedSlice"

import { HourglassEmpty, SportsScore } from '@mui/icons-material/';


const Feed = (props) => {

    //React-Redux
    const dispatch = useDispatch();

    const folder = useSelector((state) => state.feed.folder);
    const status = useSelector((state) => state.feed.status);
    const error = useSelector((state) => state.feed.error);
    const searchString = useSelector((state) => state.searchString.searchString)
    const postsData = useSelector((state) => state.feed["postsData_" + folder]);


    useEffect(() => {
        document.addEventListener("scroll", scrollHandler)
        document.addEventListener("feedIsOpened", scrollHandler)
        return function () {
            document.removeEventListener("scroll", scrollHandler)
            document.removeEventListener("feedIsOpened", scrollHandler)
        }
    }, [])

    //Variables

    let postsDataEdited = []
    if (postsData instanceof Array && postsData.length > 0) {
        postsDataEdited = [...postsData]
    }

    if (searchString && typeof searchString == "string" && searchString.length > 0) {
        postsDataEdited = postsDataEdited.filter((item) => item.title.toLowerCase().includes(searchString.toLowerCase()))
    }


    //Handlers
    const scrollHandler = (e) => {
        const scrollHeight = e.target.documentElement.scrollHeight
        const scrollTop = e.target.documentElement.scrollTop
        const windowHeight = window.innerHeight
        if (scrollHeight - (scrollTop + windowHeight) < 100) getPosts();
    }


    const getPosts = () => {
        dispatch(fetchPosts())
    }

    //Render
    return (
        <div className={s.content}>
            <div className={s.posts}>
                {
                    postsDataEdited.map((post, index) => <Post
                        key={post._id}
                        index={index}
                        folder={folder}
                        post={post}
                        dispatch={dispatch} />)
                }
                {status == "loading"
                    ? <div className={s.message}>
                        <HourglassEmpty /> Загрузка</div>
                    : ''}
                {error == "No Content"
                    ? <div className={s.message}>
                        <SportsScore /> Все посты загружены</div>
                    : ''}
            </div>
        </div>
    )
}

export default Feed;