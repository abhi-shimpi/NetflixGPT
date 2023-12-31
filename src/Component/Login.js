import React, { useRef, useState } from 'react'
import { checkValidations } from "../utils/validate";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword ,updateProfile} from "firebase/auth";
import { auth } from '../utils/firebaseConfiguration';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { login_bg_image } from '../constants/constant';

function Login() {

    const [isSignInForm, setIsSignInForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const email = useRef(null);
    const password = useRef(null);
    const name = useRef(null);
    
    const handleCheckboxChange = () => {
        setShowPassword(!showPassword);
      };
      
    const handleSubmitForm = () => {

        const errorMessage = checkValidations(email.current.value, password.current.value);

        setErrorMessage(errorMessage);

        // If there is error message it will return  , EARLY RETURN
        if (errorMessage) return;

        if (!isSignInForm) {
            // Sign Up
            // onAuthChange is called when user sign up but it does get called when updateProfile is called
            createUserWithEmailAndPassword(
                auth,
                email.current.value,
                password.current.value
            )
                .then((userCredential) => {
                    // Signed up 
                    // const user = userCredential.user;
                    // This is to update profile with displayName
                    updateProfile(auth.currentUser, {
                        displayName: name.current.value
                      }).then(() => {
                        const { uid, email, displayName } = auth.currentUser;
                        // That bug was coming bcz we are not updating displayname from here 
                        // As soon as user sign up it calls onAuth Change but in that function it does not get displayName so 
                        // it will store null so we need dispatch addUser from updateProfile function
                        dispatch(addUser({ uid, email, displayName }));
                      }).catch((error) => {
                        navigate("/error");
                      });
                })
                .catch((error) => {
                    // const errorCode = error.code;
                    const errorMessage = error.message;
                    setErrorMessage(errorMessage)
                });

        } else {
            // Sign In
            signInWithEmailAndPassword(auth,email.current.value, password.current.value)
                .then((userCredential) => {
                    // Signed in 
                    // const user = userCredential.user;
                })
                .catch((error) => {
                    // const errorCode = error.code;
                    const errorMessage = "Invalid credentials";
                    setErrorMessage(errorMessage)
                });

        }

    }



    return (
        <div className='relative'>
            <div>
                <img className='md:w-full h-[100vh] object-cover relative' src={login_bg_image} alt='loginBackgroundImage'></img>
            </div>
            <div className="absolute inset-0 w-full h-[100%] bg-gradient-to-r from-black to-black opacity-50"></div>
            <div className='w-[85%] md:w-[70%] p-6 box-border sm:p-10 top-[9%] absolute lg:w-[40%] xl:w-[30%] md:p-8 2xl:p-20 h-auto m-auto left-0 right-0 lg:top-[10%] xl:top-[15%] bg-black bg-opacity-70 rounded shadow-md text-white'>
                <form className="text-white" onSubmit={(e) => { e.preventDefault(); handleSubmitForm() }}>
                    <h1 className='mb-6 text-3xl font-bold'>{isSignInForm ? "Sign In" : "Sign Up"}</h1>
                    {
                        !isSignInForm &&
                        <div className="mb-6">
                            <input ref={name} type="name" id="full-name" name="full-name" placeholder="Enter your full name" className="w-full px-6 py-4  text-white bg-[#333] rounded" required />
                        </div>
                    }

                    <div className="mb-6">
                        <input ref={email} type="email" id="email" name="email" placeholder="Enter your email" className="w-full px-6 py-4  text-white bg-[#333] rounded" required />
                    </div>

                    <div className="mb-6">
                        <input ref={password} type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Enter your password" className="w-full px-6 py-4  text-white bg-[#333] rounded" required />
                    </div>
                    <input type='checkbox' onChange={()=>handleCheckboxChange()}/><span className='px-2'> Show password</span>

                    <div className='text-red-600 my-2 text-lg'>{errorMessage}</div>
                    {!isSignInForm && <div className='text-sm pt-2 pb-3'>(password must start with capital letter and should consist of special character and number)</div>}
                    <button type="submit" className="w-full mt-2 px-4 py-2 bg-[#e50914] text-white rounded cursor-pointer text-xl">{isSignInForm ? "Login": "Sign Up"}</button>
                </form>
                <div className='my-9 xl:my-8 md:my-4'>
                    <p className='text-sm  lg:text-xl'>
                        {isSignInForm ? "Are you new user?" : "Already registered?"} <span className='cursor-pointer text-blue-500' onClick={() => {
                            setIsSignInForm(!isSignInForm);
                            setErrorMessage("")
                        }}>{isSignInForm ? "Sign Up Now" : "Sign In Now"}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login