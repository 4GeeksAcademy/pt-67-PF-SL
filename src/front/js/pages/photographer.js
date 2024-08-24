import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/photographer.css";
import { saturation } from '@cloudinary/url-gen/actions/adjust';

export const Photographer = () => {
	const { store, actions } = useContext(Context);
	const [url, setUrl] = useState(""); 
    const [bicycle, setBicycle] = useState('');
    const [helmet, setHelmet] = useState('');
    const [price,setPrice] = useState('');
    const [user_id,setUser_id] = useState(''); /*Aqui tengo que ver como coger el user id del que esta ya logueado */
    const [loading, setLoading] = useState ('');

    const navigate = useNavigate();

    const registerInputLength = store.registerInputLength

    /*https://www.youtube.com/watch?v=b5-TEugeyuI el link del video de como implementar cloudinary */

    const changeUploadImage = async (e) => {
        e.preventDefault()
        const file = e.target.files[0]
            console.log("hi1", e)

        const cdata = new FormData();
            cdata.append("file", file);
            cdata.append("upload_preset", "BeBananaWeb")

            setLoading (true)
            console.log("helo", cdata)

        try {
            const response = await fetch(process.env.CLOUDINARY_URL + "image/upload", {
                method: "POST",
                body: cdata
            })
            console.log("cdata", cdata)

            const file = await response.json()
            setUrl(file.secure_url)
            setLoading(false)
            console.log("file", file)

            /* localStorage.setItem("url", file.secure_url);
               setStore({url: file.secure_url}); */

            return file

        }   catch (error) {
            console.log("Error uploading image:", error)
            return false 
        }
    }
    const handleUploadPhoto = async (e) => {
        e.preventDefault()
        const uploadPhoto = await actions.uploadPhoto(url, bicycle, helmet, price) /*, user_id hay que añadirlo del que ya existe*/

        if (uploadPhoto){

        }
    }

    const deleteImage = () => {
        setUrl("");
    }

	return (
		<div className="photographer-container">
            <form onSubmit={handleUploadPhoto}>
				<div className='tag-container'>
					<label htmlFor="url">Select your amazing photo:</label>
                    <div>
                        <input
                            className='file_select'
                            type="file"
                            accept='image/*'
                            placeholder='Upload an image'
                            id="url"
                            onChange={changeUploadImage}
                        />
                        {loading ? (
                                <h3 className='loading'>Loading...</h3>) : (
                                <div>
                                    <img src={url}/>
                                    {url ? (<button onClick={() => deleteImage()}>Delete photo</button>) : (<h4></h4>) }
                                </div>
                        )}   
                    </div>
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
                        className='price'
                        type="number"
                        id="price"
                        value={price}
						minLength={registerInputLength}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <button type="submit">Send it!</button>
            </form>
			<Link to="/">
				<button className="btn btn-primary">Back home</button>
			</Link>
		</div>
	);
};