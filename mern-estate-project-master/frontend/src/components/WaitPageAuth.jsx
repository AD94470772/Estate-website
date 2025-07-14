import React, { useEffect } from 'react';
import styles from "./Styles/waitpageauth.module.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

const WaitPageAuth = () => {



    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        const queryParamas = new URLSearchParams(window.location.search)
        const token = queryParamas.get('user');

        if (token) {

            const decodedToken = jwtDecode(token)
            console.log(decodedToken.user);
            dispatch(signInSuccess(decodedToken.user));

            setTimeout(() => {
                     navigate("/")
            }, 2000)
        }
        else {
            navigate("/sign-in");
        }


    }, [])

    return (
        <section>
            <div className={styles.waitPage}>
                <div className={styles.container1}>
                    <img
                        className={styles.animation1}
                        src="https://hawkemedia.com/wp-content/uploads/2023/05/A-Simple-Guide-n-How-to-Include-Animation-in-your-Emails.gif"
                        alt="Redirecting"
                    />
                    <p>Redirecting To Home Page...</p>
                </div>
            </div>
        </section>
    );
};

export default WaitPageAuth;
