import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import beBananaLogo from "/workspaces/pt-67-PF-SL/src/front/img/BeBanana.png";
import "../../styles/navbar.css";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const {store, action} = useContext(Context)
		const token = store.token

	const handleLogout = () => {

		console.log(token)
        localStorage.removeItem('token');
        navigate('/');
    };

	const handleLogin = async (e) => {
            navigate("/login");
    }

	return (
		<nav className="navbar p-3 m-3" style={{ backgroundColor: 'rgba(46, 39, 1, 0.8)' }}>
			<div className="navbar-container">
				<div className="navbar-container-side">
					<Link to="/">
						<img src={beBananaLogo} alt="Be Banana Logo" style={{ height: "75px" }} className="navbar-logo mb-0 h1" />
					</Link>
					<h2 className="be-banana">BeBanana</h2>
				</div>
				<div className="navbar-container-side">
					<div className="navbar-link ml-auto">
						<Link to="/demo">
							<button className="btn btn-secondary">Demo</button>
						</Link>
					</div>
					{(location.pathname !== "/login" && location.pathname !== "/register") && (token ? 
						<button className="navbar-boton btn btn-lg" onClick={handleLogout}>Logout</button> : 
						<button className="navbar-boton" onClick={handleLogin}>Login</button>
					)}
					
				</div>
			</div>
		</nav>
	);
};
