import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from "../../App"

const Profile = () => {
    const [mypic, setpics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    // console.log(state)
    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                setpics(result.mypost)
            })
    }, [])

    useEffect(() => {
        if (image) {
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
                    console.log(data)
                    localStorage.setItem("user",JSON.stringify({...state,Pic:data.url}))
                    dispatch({type:"UPDATEPIC",payload:data.url})
                    // fetch('/updatepic',{
                    //     method:"put",
                    //     headers:{
                    //         "Content-Type":"application/json",
                    //         "Authorization":"Bearer "+localStorage.getItem("jwt")
                    //     },
                    //     body:JSON.stringify({
                    //         Pic:data.url
                    //     })
                    // }).then(res=>res.json())
                    // .then(result=>{
                    //     console.log(result)
                    //     localStorage.setItem("user",JSON.stringify({...state,Pic:result.url}))
                    //     dispatch({type:"UPDATEPIC",payload:result.url})
                    // })
                    window.location.reload()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])

    const updatePhoto = (file) => {
        setImage(file)
    }
    return (
        <main style={{ maxWidth: "650px", margin: "0 auto" }}>
            <div className="pro">
                <div className="profile">
                    <div className="card-left">
                        <img
                            src={state ? state.Pic : "loading"}
                        />
                    </div>
                    <div className="card-right">
                        <h4>{state ? state.name : "loading"}</h4>
                        <h5>{state ? state.email : "loading"}</h5>
                        <div className="card-item">
                            <h5>{mypic.length} posts</h5>
                            <h5>{state ? state.followers.length : "0"} followers</h5>
                            <h5>{state ? state.following.length : "0"} following</h5>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field">
                    <div className="btn">
                        <input type="file"
                            id="upload" className="hidden"
                            onChange={(e) => updatePhoto(e.target.files[0])}
                        />
                        <label for="upload">UpdatePic</label>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            <hr />
            <div className="gallery">
                {
                    mypic.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </main>
    )
}

export default Profile