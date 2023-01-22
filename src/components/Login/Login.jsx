import React, { useEffect } from "react";
import s from "./Login.module.css"
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

let loginMessage = "Введите данные пользователя"

const Login = () => {

    const state = useSelector((state) => state.auth) 
    const dispatch = useDispatch()

    const currentActivity = useSelector((state) => state.auth.currentActivity)
    console.log(currentActivity)

    const loggin = (e) => {
        e.preventDefault()
        dispatch({
            type: "LOGIN"
        })
    }

    return (
        <div className={s.background}>
            <div className={s.wrapper}>

                {/* WELCOME HALF */}
                <div className={s.left}>
                    <h1>Welcome to</h1>
                    <div className={s.logoName}>
                        <span className={s.charColor}>S</span>
                        TORY
                        <span className={s.charColor}>S</span>
                        ERF
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Nulla neque sint debitis voluptate ab illum deserunt accusamus cupiditate accusantium repellendus.
                    </div>
                    <div>
                        У вас ещё нет аккаунта в StorySerf?
                    </div>
                    <Link to="/register" className={s.button}>Зарегистрироваться</Link>
                </div>

                {/* INPUT HALF */}
                <div className={s.right}>
                    <form 
                        className={s.right_form}
                        onSubmit = {loggin}>
                        <h1>Авторизация</h1>
                        <div className={s.loginMessage}>{loginMessage}</div>
                        <input
                            name="username"
                            type='text'
                            placeholder="Введите логин"

                            autoComplete="on"
                            className={s.inputText} />
                        <input
                            name='name'
                            type='password'
                            placeholder="Введите пароль"

                            autoComplete="on"
                            className={s.inputText} />
                        <button
                            type="submit"
                            name="submit"
                            value="Отправить"
                            className={s.button}>
                            Отправить</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;