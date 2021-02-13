import React, {useState, useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../../App'

const Login = () =>{
    const {state, dispatch} =  useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const PostData = () =>{
        if(!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)){
            window.alert("invalid email")
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
            window.alert(data.error)
            // M.toast({html: data.error})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                window.alert("login success")
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <main style={{maxWidth:"650px", margin:"0 auto"}}>
        <div className="signin">
            <div className="card">
                <h2>SocialApp</h2>
                <input 
                type="text" 
                placeholder="email"
                value={email} 
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                type="password" 
                placeholder="password"
                value={password} 
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn"
                onClick={()=>PostData()} 
                >Login</button>
                <h5>
                    <Link to="/signup" className="account">Dont have an account ?</Link>
                </h5>
            </div>
        </div>
        </main>
    )
}

export default Login