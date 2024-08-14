const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			users: [],
			message: null,
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
			]
		},

		actions: {
			login: async(email, password) => {
                try {
                    let response = await fetch("https://crispy-space-couscous-g4x5rvx4x7j6fjj4.github.dev/api/login", {
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
                    return true

                }   catch (error) {
                    return false 
                }
        },
		register: async(email, password, username, name, firstname, role) => {
			try {
				let response = await fetch("https://crispy-space-couscous-g4x5rvx4x7j6fjj4.github.dev/api/register", {
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
				return true

			}   catch (error) {
				return false 
			}
		},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
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
