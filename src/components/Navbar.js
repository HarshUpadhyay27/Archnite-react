import React, { useContext, useState, useRef, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const NavBar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const history = useHistory()
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])
    const [ShowLink, setShowLink] = useState(true)
    const [isOpen, setOpen] = useState(false)
    const { state, dispatch } = useContext(UserContext)
    const renderList = () => {
        if (state) {
            return [
                <li key="1" className="list-item"><i data-target="modal1" className="material-icons modal-trigger">search</i></li>,
                <li key="2" className="list-item"><Link to="/profile">Profile</Link></li>,
                <li key="3" className="list-item"><Link to="/create">CreatePost</Link></li>,
                <li key="4" className="list-item"><Link to="/myfollowerpost">MyFollowingPosts</Link></li>,
                <li key="5">
                    <button className="log-out"
                        onClick={() => {
                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            history.push("/signin")
                        }}
                    >Logout</button>
                </li>
            ]
        } else {
            return [
                <li key="6" className="list-item"><Link to="/signin">Login</Link></li>,
                <li key="7" className="list-item"><Link to="/signup">SignUp</Link></li>
            ]
        }
    }

    const fetchUser = (query)=>{
        setSearch(query)
        fetch('/api/search-users',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(results=>{
            setUserDetails(results.user)
        })
    }

    return (
        <nav>
            <div className="nav" id={ShowLink ? "h-res" : ""}>
                <Link to={state ? "/" : "/signin"} className="logo">SocialApp</Link>
                <div className="nav-div"></div>
                <ul className="list-items" id={ShowLink ? "v-res" : ""}>
                    {renderList()}
                </ul>
            </div>
            <div onClick={() => setShowLink(!ShowLink)}>
                <i className="material-icons burger" toggled={isOpen} toggle={setOpen}>dehaze</i>
            </div>
            <hr />
            <div id="modal1" className="modal" ref={searchModal}>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="search users"
                        defaultvalue={search}
                        onClick={(e) => fetchUser(e.target.value)}
                    />
                    <ul className="collection">
                    {userDetails.map(item=>{
                        return <Link to={item._id!==state._id?"/profile/"+item._id:'/profile'} onClick={()=>{
                            M.Modal.getInstance(searchModal.current).close()
                            setSearch('')
                        }}> <li className="collection-item">{item.email}</li> </Link>
                    })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>CLOSE</button>
                </div>
            </div>
        </nav>

    )
}

export default NavBar