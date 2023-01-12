import React from 'react'

import { useNavigate } from "react-router-dom"
import * as userService from '../services/UserServices'
import { useEffect, useState } from 'react'
import { User } from '../models/User'
import Moment from 'react-moment'
import '../css/UpdateUser.css'
import '../css/Login.css'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { ImportsNotUsedAsValues } from 'typescript'
type UserForm = {
    name?: String;
    username?: String;
    email?: String;
    birthdate?:Date;
    password: String;
};
type FormValues = {
    name?: String;
    username?: String;
    email?: String;
    birthdate?:Date;
    password: String;
};

const UpdateUserValues: React.FC = () => {
    let clickCreateEvent = true
    const [user, setUser] = useState<User>();
    let navigate = useNavigate();
    const handleClick = () => navigate('/updateUser');
    let [registerView, setRegister] = useState(false);
    const actualDate = new Date().getTime();
    const minDate = new Date().getTime() - new Date().setTime(1000 * 60 * 60 * 24 * 365 * 13);
        
    const {
        register,
        handleSubmit,
        formState: { errors }
      } = useForm<FormValues>({
        defaultValues: {
          name: user?.name,
          username: user?.username,
          email: user?.email,
          birthdate: user?.birthdate,
        }
    });
    
    const handleRegi = handleSubmit(async (values) => {
        console.log(values);
        if (!values.birthdate){
           values.birthdate = user?.birthdate;
        }
        if (!values.username){
            values.username = user?.username;
        }
        if (!values.name){
            values.name = user?.name;
        }
        if (!values.email){
            values.email = user?.email;
        }
        const res = await userService.updateUser(values);
        console.log(res);
        navigate('/updateUser');
    });

    const loadUser = async () => {
        let user = await userService.getProfile();
        let getUser = user.data as User;
        setUser(getUser);
    }
    useEffect(() => {
        loadUser()
    }, [])
    
    return (
        <div className="update-values-container">
            <form className='update-user' style={registerView ? {paddingBottom: "20px", width: "450px", marginLeft: "0vw"} : {paddingBottom: "20px", width: "450px"}} action="register" onSubmit={handleRegi}>

            <span className="update-user-header">Profile</span>
                <div className='login-input-container'>
                    <label style={{marginBottom: "20px"}} htmlFor="regName">Name</label>
                    <input type="text" id="name" {...register("name", {
        maxLength: {
            value: 20,
            message: "Name must not exceed 20 characters"
        },
        minLength: {
            value: 2,
            message: "Name must be at least 2 characters"
        }
        
    })} 
    placeholder="Enter your new name"/>
                    <p className="error-message">{errors.name?.message}</p>
                </div>
				<div style={{display: "inline-flex", justifyContent: "center", width: "80%"}}>
					<div style={{marginRight: "2%"}} className='login-input-container'>
                	    <label style={{marginBottom: "20px"}} htmlFor="regUsername">Username</label>
                	    <input style={{width: "95%"}} type="text" id="username" {...register("username", {
        maxLength: {
            value: 20,
            message: "Username must not exceed 20 characters"
        },
        minLength: {
            value: 2,
            message: "Username must be at least 2 characters"
        }, 
    })} 
    placeholder="Enter your new username"/>
                        <p className="error-message">{errors.username?.message}</p>
                	</div>
					<div style={{marginRight: "-2.6%", marginLeft: "2%"}} className='login-input-container'>
                	    <label style={{marginBottom: "20px"}} htmlFor="regUsername">Birth date</label>
                	    <input style={{width: "95%"}} type="date" id="birthdate" {...register("birthdate", {                                                             
                    validate: (date) =>
                        date ? new Date(date).getTime() > actualDate ? "You can not be born in the future" :
                        new Date(date).getTime() > minDate ? "You can not be under 13 years old" : true : true
    })}/>
                        <p className="error-message">{errors.birthdate?.message}</p>
                	</div>
				</div>
				<div className='login-input-container'>
                    <label htmlFor="registerEmail">Email</label>
                    <input type="email" id="email" {...register("email", {
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                        }
       
    })} 
        placeholder="Enter your new email"/>
                    <p className="error-message">{errors.email?.message}</p>
                </div>
                <div className='login-input-container login-center'>
                    <button className='login-button' type="submit" onClick={handleRegi}>Update user</button>
                </div>
            <div className="back-button" style={{marginRight: "280vw"} }onClick={handleClick}>
            </div> 
            </form>
        </div>		
    )
}
export default UpdateUserValues