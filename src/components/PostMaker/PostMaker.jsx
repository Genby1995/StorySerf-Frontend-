import React, { useState } from "react";
import s from "./PostMaker.module.css";
import { useDispatch, useSelector } from "react-redux";
import { PlaylistAdd, AddAPhoto, Publish, DragHandle, DeleteForever, HourglassEmpty } from "@material-ui/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  changeTitle as changeTitle_AC,
  changeText as changeText_AC,
  addText as addText_AC,
  addImg as addImg_AC,
  reorder as reorder_AC,
  removeItem as removeItem_AC,
  uploadImg as uploadImg_AC,
  publishPost as publishPost_AC
} from "../../redux/postMakerSlice";
import Compressor from "compressorjs";



const PostMaker = (props) => {


  //React-Redux
  const dispatch = useDispatch();
  const title = useSelector((state) => state.postMaker.postTitle)
  const postBody = useSelector((state) => state.postMaker.postBody)
  const message = useSelector((state) => state.postMaker.message)
  const status = useSelector((state) => state.postMaker.status)
  const error = useSelector((state) => state.postMaker.error)

  //Handlers with Dispatches
  const handleAddImg = (e) => {
    e.preventDefault();
    dispatch(addImg_AC())
  }

  const handleAddText = (e) => {
    e.preventDefault();
    dispatch(addText_AC())
  }

  const handleChangeFileInput = (e) => {
    let itemId = e.target.closest("div").dataset.id
    const file = e.target.files[0]
    new Compressor(file, {
      convertSize: 300000,
      quality: 0.6,
      maxHeight: 1080,
      maxWidth: 1920,
      success(result) {
        dispatch(uploadImg_AC({
          itemId: itemId,
          file: result
        }))
      },
      error(err) {
        console.log(err.message);
      },
    })
    dispatch(uploadImg_AC({
      itemId: itemId,
      file: e.target.files[0]
    }))
  }

  const handleRemoveItem = (e) => {
    let itemId = e.target.closest("div").dataset.id
    dispatch(removeItem_AC(itemId));
  }

  const handleChange = (e) => {
    resizeTextArea(e)
    if (e.target.name == "title") {
      dispatch(changeTitle_AC(e.target.value))
    } else if (e.target.name == "text") {
      dispatch(changeText_AC({
        text: e.target.value,
        position: e.target.dataset.position
      }))
    }
  }

  const handlePublishPost = (e) => {
    e.preventDefault();
    dispatch(publishPost_AC())
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(postBody);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(reorder_AC(items));
  }

  //Handlers without Dispatches
  const resizeTextArea = (e) => {
    var el = e.target;
    setTimeout(function () {
      el.style.cssText = 0;
      el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }, 1);
  }

  // Render
  return (
    <div className={s.content}>
      <form className={s.post}>

        {(status == "loading")
          ? <span className={s.veil}><HourglassEmpty /> Загрузка</span>
          : ""}

        <div className={s.title}>
          <textarea
            onChange={handleChange}
            onFocus={resizeTextArea}
            value={title}
            name="title"
            placeholder="Введите заголовок поста"
            id=""
          />
        </div>
        <div name="DnD_container" className={s.postContent}>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="postMaker" key="postMaker">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>

                  {postBody.map((item, index) => {

                    switch (item.type) {

                      case "text":
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                className={s.item}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <div {...provided.dragHandleProps}>
                                  <DragHandle className={s.dragHandle} />
                                </div>
                                <textarea
                                  name="text"
                                  data-position={index}
                                  onChange={handleChange}
                                  className={s.textItem}
                                  value={item.content}
                                />
                                <div className={s.deleteButton} data-id={item.id} >
                                  <DeleteForever onClick={handleRemoveItem} />
                                </div>
                              </li>
                            )}
                          </Draggable>
                        )

                      case "img":
                        return (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                className={s.item}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <div {...provided.dragHandleProps}>
                                  <DragHandle className={s.dragHandle} />
                                </div>
                                {
                                  (item.content && item.content !== "")
                                    ? <div className={s.imgItem}>
                                      <img className={s.imgItem} src={item.content} alt="" />
                                    </div>
                                    : <label className={s.imgItemEmpty} htmlFor={`postmaker_img${item.id}`}>
                                      <AddAPhoto />
                                    </label>
                                }
                                <div className={s.deleteButton} data-id={item.id} >
                                  <input onChange={handleChangeFileInput} type="file" id={`postmaker_img${item.id}`} accept="image/*, .jpg, .jpeg, .png, .gif, .web" hidden />
                                  <DeleteForever onClick={handleRemoveItem} />
                                </div>
                              </li>
                            )}
                          </Draggable>
                        )
                    }
                  })
                  }
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

        </div>
        <div className={message.color == "warning"
          ? s.message + " " + s.warning
          : s.message}>
          {message.text}
        </div>
        <div className={s.actions}>
          <button
            name="add_text"
            onClick={handleAddText}
            className={s.actionButton}>
            <PlaylistAdd /> Добавить текст
          </button>
          <button
            name="add_img"
            onClick={handleAddImg}
            className={s.actionButton}>
            <AddAPhoto /> Добавить изображение </button>
          <button
            name="publish"
            onClick={handlePublishPost}
            className={s.actionButton}
          >
            <Publish /> Опубликовать  </button>
        </div>
      </form>
    </div>
  )
}


export default PostMaker;