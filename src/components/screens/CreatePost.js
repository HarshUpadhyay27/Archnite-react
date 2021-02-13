import React, { useState, useEffect } from "react";

const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() => {
        if(url){
        fetch("/createpost", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                title,
                body,
                pic: url
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    window.alert(data.error)
                    // M.toast({html: data.error})
                }
                else {
                    window.alert("created post successfully")
                    // history.push('/signin')
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }, [url])

    const postDetails = () => {
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

    return (
        <main style={{maxWidth:"650px", margin:"10px auto"}}>
            <div className="create">
                <input
                    type="text"
                    placeholder="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn">
                        <input type="file"
                            id="upload" className="hidden"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <label for="upload">UPLOAD IMAGE</label>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn-submit"
                    onClick={() => postDetails()}
                >SUBMIT POST</button>
            </div>
        </main>
    )
}

export default CreatePost