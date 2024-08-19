import React, { useContext } from "react";
import { Context } from "../store/appContext";
import beBananaLogo from "/workspaces/pt-67-PF-SL/src/front/img/BeBanana.png";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="landing-container text-center mt-5">
			<div className="landing-contianer-left text-center mt-5">
				<div className="landing-logo">
					<p>
						<img className="landing-banana" src={beBananaLogo} />
					</p>
					<h1>BeBanana</h1>
				</div>
				<p>Aqui puedo poner texto</p>
			</div>
			<div className="landing-contianer-right text-center mt-5">
				<div className="alert alert-info">
					{store.message || "Loading message from the backend (make sure your python backend is running)..."}
				</div>
				<p>
					This boilerplate comes with lots of documentation:{" "}
					<a href="https://start.4geeksacademy.com/starters/react-flask">
						Read documentation
					</a>
				</p>
			</div>
		</div>
	);
};
