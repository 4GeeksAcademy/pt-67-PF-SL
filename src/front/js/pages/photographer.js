import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/photographer.css";

export const Photographer = () => {
	const { store, actions } = useContext(Context);
	const [Url_Image, SetUrl_Image] = useState("");
    const [bicycle, setBicycle] = useState('');
    const [helmet, setHelmet] = useState('');
    const [price,setPrice] = useState('');
    const [name,setName] = useState('');

    const navigate = useNavigate();

    const registerInputLength = store.registerInputLength

    const handleUploadPhoto = async (e) => {
        e.preventDefault()
        const uploadPhoto = await actions.uploadPhoto(Url_Image, bicycle, helmet, price, user_id)

        if (uploadPhoto){
            navigate(registered.role === 'Rider' ? '/rider' : '/photographer');
            console.log("register", registered)
        }
    }

	return (
		<div className="photographer-container">
            <form onSubmit={handleUploadPhoto}>
				<div className='tag-container'>
					<label htmlFor="Url_Image">Select your amazing picture:</label>
                    <input
                        type="file"
                        id="Url_Image"
						accept='image'
                        value={Url_Image}
                        onChange={(e) => SetUrl_Image(e.target.value)}
                    />
				</div>
				<div className='tag-container'>
                    <label htmlFor="bicycle">Bicycle:</label>
                    <select id="bicycle" type="bicycle" value={bicycle} onChange={(e) => setBicycle(e.target.value)}>
                        <option value="">Witch Bike is sending it?</option>
                        <option value="santa_Cruz">Santa Cruz</option>
                        <option value="Kona">Kona</option>
                    </select>
                </div>
				<div className='tag-container'>
                    <label htmlFor="helmet">Helmet:</label>
                    <select id="bicycle" type="bicycle" value={helmet} onChange={(e) => setHelmet(e.target.value)}>
						<option value="">Witch Helmet protects our Bananer?</option>
                        <option value="scott">Scott</option>
                        <option value="troyLee">TroyLee</option>
                    </select>
                </div>
				<div className='tag-container'>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="firstname"
                        value={price}
						minLength={registerInputLength}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <button type="submit">Send it!</button>
                <Link to="/login">
				    <span className="btn btn-lg" href="#" role="button">
					    Login here if you are Bananer
				    </span>
			    </Link>
            </form>
			<Link to="/">
				<button className="btn btn-primary">Back home</button>
			</Link>
		</div>
	);
};