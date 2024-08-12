import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const login = () => {
    const {actions} = useContext(Context)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault()
        const logged = await actions.login(email, password)

        if (logged){
            navigate("/home");
        }
    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">login</button>
                <Link to="/">
				    <span className="btn btn-primary btn-lg" href="#" role="button">
					    Register
				    </span>
			    </Link>
            </form>
        </div>
    );
};

export default login;