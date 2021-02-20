import React, {useState, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
// import M from 'materialize-css'

const Signup = () =>{
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("") 
    const [url, setUrl] = useState(undefined) 
    useEffect(() =>{
        if(url){
            uploadFields()
        }
    },[url])

    const uploadPic = () =>{
        const data = new FormData()
        data.append('file', image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "dfkq2jpbw")
        fetch("https://api.cloudinary.com/v1_1/dfkq2jpbw/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const uploadFields = () =>{
        if(!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)){
            window.alert("invalid email")
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                Pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
            window.alert(data.error)
            // M.toast({html: data.error})
            }
            else{
                window.alert(data.massage)
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    const PostData = () =>{
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
        
    }

    return(
        <main style={{maxWidth:"650px", margin:"0 auto"}}>
        <div className="signup">
            <div className="card">
                <h2>SocialApp</h2>
                <input 
                type="text" 
                placeholder="name" 
                value={name} 
                onChange={(e)=>setName(e.target.value)}
                />
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
                <div className="file-field input-field">
                    <div className="btn">
                        <input type="file"
                            id="upload" className="hidden"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <label for="upload">upload Pic</label>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn" onClick={()=>PostData()}>SignUp</button>
                <h5>
                    <Link to="/signin" className="account">Already have an account ?</Link>
                </h5>
            </div>
        </div>
        </main>
    )
}

export default Signup