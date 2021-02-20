import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from "../../App"
import { useParams } from 'react-router-dom'

const Profile = () => {
    const [userProfile, setProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const { userid } = useParams()
    const [showfollow,setshowFollow] = useState(state?!state.following.includes(userid):true)
    // console.log(userid)
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                setProfile(result)
            }) 
    }, [])

    const followUser = () => {
        fetch('/api/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                // console.log(data)
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                setProfile((prevState)=>{
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:[...prevState.user.followers,data._id]
                        }
                    }
                })
                setshowFollow(false)
            })
    }

    const unfollowUser = () => {
        fetch('/api/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                // console.log(data)
                dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
                localStorage.setItem("user",JSON.stringify(data))
                setProfile((prevState)=>{
                    const newFollowers = prevState.user.followers.filter(item=>item != data._id)
                    return{
                        ...prevState,
                        user:{
                            ...prevState.user,
                            followers:newFollowers
                        }
                    }
                })
                setshowFollow(true)
            })
    }

    return (
        <>
            {userProfile ?
                <main style={{ maxWidth: "750px", margin: "0 auto" }}>
                    <div className="profile">
                        <div className="card-left">
                            <img
                                src={userProfile.user.Pic}
                            />
                        </div>
                        <div className="card-right">
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div className="card-item">
                                <h5>{userProfile.posts.length} posts</h5>
                                <h5>{userProfile.user.followers.length} followers</h5>
                                <h5>{userProfile.user.following.length} following</h5>
                            </div>
                            {showfollow?
                            <button className="btn-follow" onClick={() => followUser()}>FOLLOW</button>
                            :
                            <button className="btn-follow" onClick={() => unfollowUser()}>UNFOLLOW</button>
                            }
                        </div>
                    </div>
                    <hr />
                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                                )
                            })
                        }
                    </div>
                </main>
                : <h2>loading...</h2>}
        </>
    )
}

export default Profile