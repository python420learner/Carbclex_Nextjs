"use client"
import { React, useState } from "react";
import "./page.css"
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGenderless,faPerson,faPersonDress,faCheck, faC } from "@fortawesome/free-solid-svg-icons";
import { app } from '../firebase';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formState,setFormState] = useState('signup')

  const submitHandler = async (event) => {
    event.preventDefault();
    const auth = getAuth(app);
    try {
        // Register the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user,{
          url:'http://localhost:3000/login'
        })

        alert("Verification email sent! Please check your inbox.");
    } catch (error) {
        console.error("Error registering user:", error);
        alert(error.message);
    }
    // setFormState('verification')
};

  return (
    <>
      <div className="Container">
        <div className="left_container" style={{width:'40vw',height:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
          <div style={{color:'white',padding:'2rem'}}>
            <h1>Join the Adventure !</h1>
            <p>Lorem ipsum dolor sit amet, con magnam? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas perspiciatis magni molestiae ex</p>
          </div>
        </div>
        <div className="right_container">
          {formState === 'signup' && (
            <form onSubmit={submitHandler}>
              <div className="inputs">
                <div className="names">
                  <label htmlFor="name">
                    <span className="important">*</span>Name
                  </label>
                  <br/>
                  <input className="sign_input" type="text" placeholder="First name*" onChange={(e) => setName(e.target.value)} required />
                  <input className="sign_input" type="text" placeholder="Middle name" />
                  <input className="sign_input" type="text" placeholder="Last name" />
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div >
                    <label htmlFor="country">
                      <span className="important">*</span>Country
                    </label>
                    <br/>
                    <select style={{width:'100%',padding:'1rem 3rem',borderRadius:'30rem'}}>
                      <option value="India" key="ind">India</option>
                      <option value="India" key="usa">USA</option>
                      <option value="India" key="aus">Australia</option>
                    </select>
                  </div>
                  <div className="gender">
                    <li><FontAwesomeIcon icon={faPerson}  style={{marginRight:'8px'}} size='2x'/></li>
                    <li><FontAwesomeIcon icon={faPersonDress}  style={{marginRight:'8px'}} size='2x'/></li>
                    <li><FontAwesomeIcon icon={faGenderless}  style={{marginRight:'8px'}} size='2x'/> Others</li>
                    <div>


                    </div>
                  </div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div>
                    <label htmlFor="phone">
                      <span className="important">*</span>Phone no.
                    </label>
                    <br/>
                    <input className="sign_input" style={{width:'100%'}} type="tel" placeholder="11-2222-3333" required />

                  </div>
                  <div>
                    <label htmlFor="email">
                      <span className="important">*</span>e-mail
                    </label>
                    <br/>
                    <input className="sign_input" style={{width:'100%'}} onChange={(e) => setEmail(e.target.value)} type="email" name="email" placeholder="john@example.email" required/>

                  </div>
                </div>
                <div>
                    <label htmlFor="password">
                      <span className="important">*</span>Set New Password
                    </label>
                    <br/>
                    <input className="sign_input" style={{width:'100%'}} onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="password*"/>
                </div>
                <p style={{fontSize:'15px',marginLeft:'2rem'}}><span style={{marginRight:'1rem'}}><input type="checkbox"/></span>i agree to <b>Terms and Conditions</b></p>
                <button className="btnTag" style={{marginBottom:'10px'}}>Sign up</button>
                <Link href="/login" ><button className="btnTag">Login</button></Link>
              </div>
            </form>
          )}
          {formState === 'verification' && (
            <div style={{display:'flex',flexDirection:'column',width:'80%',marginTop:'40%',gap:'0.5rem',marginBottom:'0',textAlign:'center',color:'white'}}>
              <h2>Dear {name} <br/>Thanks for joining</h2>
              <FontAwesomeIcon icon={faCheck} color='white' size='8x'/>
              <h2>Verification link is send to your email.</h2>
              <p style={{marginTop:'1.5rem'}}>E-mail not received? <u>Click here to resend</u></p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUp;