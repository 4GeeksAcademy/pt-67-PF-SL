import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import beBananaLogo from "/workspaces/pt-67-PF-SL/src/front/img/BeBanana.png";

export const Navbar = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

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
							<button className="btn btn-secondary">Photos uploaded</button>
						</Link>
					</div>
					{location.pathname !== "/login" && (
						<button className="navbar-boton btn btn-lg" onClick={handleLogout}>Logout</button>
					)}
				</div>
			</div>
		</nav>
	);
};
