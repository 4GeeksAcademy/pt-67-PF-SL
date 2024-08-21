import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import beBananaLogo from "/workspaces/pt-67-PF-SL/src/front/img/BeBanana.png";
import "../../styles/navbar.css";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const {store, actions} = useContext(Context)

	useEffect(()=>{console.log(store.token)}, [])

	const handleLogout = () => {
		actions.logout()
        navigate('/');
    };

	const handleLogin = async (e) => {
            navigate("/login");
    }

	return (
		<nav className="navbar p-3 m-3" style={{ backgroundColor: 'rgba(46, 39, 1, 0.8)' }}>
			<div className="navbar-container">
				<div className="navbar-container-left">
					<Link to="/">
						<img src={beBananaLogo} alt="Be Banana Logo" style={{ height: "75px" }} className="navbar-logo mb-0 h1" />
					</Link>
					<h1 className="be-banana">BEBANANA</h1>
				</div>
				<div className="navbar-container-right">
					<div className="navbar-link ml-auto">
						<Link to="/demo">
							<button className="btn btn-secondary">Demo</button>
						</Link>
					</div>
					{(location.pathname !== "/login" && location.pathname !== "/register") && (store.token ? 
						<button className="navbar-boton btn btn-lg" onClick={handleLogout}>Logout</button> : 
						<button className="navbar-boton" onClick={handleLogin}>Login</button>
					)}
					
				</div>
			</div>
		</nav>
	);
};
