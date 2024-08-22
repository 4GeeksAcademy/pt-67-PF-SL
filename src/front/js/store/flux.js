const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			message: null,
			token:"",
			registerInputLength: 1,
			photo: [],
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
		},

		actions: {
			login: async(email, password) => {
				const store = getStore()
                try {
                    let response = await fetch(process.env.BACKEND_URL + "api/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "email": email,
                            "password": password
                        })
                    })

                    const data = await response.json()
                    localStorage.setItem("token", data.access_token);
					setStore({token: data.access_token})

                    return data

                }   catch (error) {
                    return false 
                }
			},
			logout: () => {
				localStorage.removeItem('token');
				setStore({token: ""})
			},

			register: async(email, password, username, name, firstname, role) => {
				try {
					let response = await fetch(process.env.BACKEND_URL + "api/register", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							"email": email,
							"password": password,
							"username": username,
							"name": name,
							"firstname": firstname,
							"role": role
						})
					})

					const data = await response.json()
					localStorage.setItem("token", data.access_token);
					setStore({token: data.access_token})

					return data

				}   catch (error) {
					return false 
				}
			},
			uploadPhoto: async(Url_Image, bicycle, helmet, price, user_id) => {
				try {
					let response = await fetch(process.env.BACKEND_URL + "api/photos", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							"Url_Image": Url_Image,
							"bicycle": bicycle,
							"helmet": helmet,
							"price": price,
							"user_id": user_id, /*Aqui tengo que ver como coger el user id del que esta ya logueado */
						})
					})

					const data = await response.json()
					localStorage.setItem("photo", data.photo);
					setStore({photo: data.photo})

					return data

				}   catch (error) {
					return false 
				}
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
