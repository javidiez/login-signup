import { useContext, createContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [users, setUsers] = useState([]);
	const [contactoElegido, setContactoElegido] = useState({})
	const [name, setName] = useState(sessionStorage.getItem('name') || '');
    const [email, setEmail] = useState(sessionStorage.getItem('email') || '');
    const [password, setPassword] = useState('');
	const [token, setToken] = useState(sessionStorage.getItem('token') || '')
	const [favoriteTeam, setFavoriteTeam] = useState(null);
	const [userId, setUserId] = useState(sessionStorage.getItem('userId') || ''); // Estado para userId


	const fetchUsers = async () => {
		try {
			const response = await fetch('http://127.0.0.1:5000/users');

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setUsers([...data]);
		} catch (error) {
			console.error('There was an error fetching the users!', error);
		}
	};

	const deleteUser = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/users/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok ${response.statusText}`);
            }

            // Actualiza el estado de la lista de usuarios después de eliminar
            setUsers(users.filter(user => user.id !== id));

            console.log('User deleted successfully');
        } catch (error) {
            console.error('There was an error deleting the user:', error);
        }
    };

	const editUser = async (id, name, email, password) => {
		try {
			const response = await fetch(`http://127.0.0.1:5000/users/edit/${id}`, {
				method: "PUT",
				body: JSON.stringify({ name, email, password }),
				headers: {
					"Content-Type": "application/json"
				}
			});
	
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
	
			const data = await response.json();
			// Actualiza el usuario en la lista existente
			setUsers(users.map(user => (user.id === id ? data : user)));
			console.log('User updated successfully:', data);	
			fetchUsers();
		} catch (error) {
			console.error('There was an error updating the user:', error);
		}
	};
	

	const singleContact = (id) => {
		const usuarioElegido = users.find((usuario) => usuario.id === id);
		setContactoElegido(usuarioElegido || {});
	};
	
	const logIn = async (email, password) => {
		try {
			const resp = await fetch(`http://127.0.0.1:5000/login`, {
				method: "POST",
				body: JSON.stringify({ name, email, password }),
				headers: { "Content-Type": "application/json" }
			});
			const data = await resp.json();
			
			if (data.token) { 
				// Guardar el token en el estado
				
	
				// Guardar el token en sessionStorage
				sessionStorage.setItem('token', data.token);
				sessionStorage.setItem('name', data.name);
				sessionStorage.setItem('email', data.email);
				sessionStorage.setItem('userId', data.userId);  // Guardar userId
                setToken(data.token);
                setName(data.name);
                setEmail(data.email);
                setUserId(data.userId);  // Actualizar el estado
				setFavoriteTeam(data.favoriteTeam)
				console.log("Success:", data);
			} else {
				console.error("Token no recibido:", data);
			}
		} catch (error) {
			console.error("Network error:", error);
		}
	};

	const signUp = async () => {
        try {
            // Enviar la solicitud POST usando fetch
            const response = await fetch('http://127.0.0.1:5000/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                }),
            });
			
			if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
			const data = await response.json();
			if (data.access_token) { 
				// Guardar el token en el estado
				
				setUsers([...users, data]);
				// Guardar el token en sessionStorage
				sessionStorage.setItem('token', data.access_token);
				sessionStorage.setItem('name', data.name);
				sessionStorage.setItem('email', data.email);
				setToken(data.access_token);
				setName(data.name);
				setEmail(data.email);
				setFavoriteTeam(null);
				await logIn(email, password);
				await fetchFavoriteTeam();
			} else {
				console.error("Token no recibido:", data);
			}
		} catch (error) {
			console.error("Network error:", error);
		}
	};

	const logOut = () => {
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('name');
		sessionStorage.removeItem('email');
		sessionStorage.removeItem('userId');  // Eliminar userId
        setToken('');
        setName('');
        setEmail('');
        setPassword('');
        setUserId(''); 
	}

	const fetchFavoriteTeam = async () => {
		try {
			const storedUserId = sessionStorage.getItem('userId');
			if (!storedUserId) {
				console.error('No userId available');
				return;
			}
	
			const response = await fetch(`http://127.0.0.1:5000/user/${storedUserId}/favorite_team`);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
	
			const data = await response.json();
			setFavoriteTeam(data);
			console.log("Data guardada:"+ data.name);
		} catch (error) {
			console.error('There was an error fetching the favorite team!', error);
		}
	};
	
	

// Agregar función para actualizar equipo favorito
const updateFavoriteTeam = async (userId, teamId) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/user/${userId}/favorite_team`, {
            method: 'PUT',
            body: JSON.stringify({ team_id: teamId }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error(`Network response was not ok ${response.statusText}`);

        console.log('Favorite team updated successfully');
        fetchUsers(); // Volver a cargar la lista de usuarios
    } catch (error) {
        console.error('There was an error updating the favorite team:', error);
    }
};

useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedName = sessionStorage.getItem('name');
    const storedEmail = sessionStorage.getItem('email');
    const storedUserId = sessionStorage.getItem('userId');

    if (storedToken) {
        setToken(storedToken);
    }
    if (storedName) {
        setName(storedName);
    }
    if (storedEmail) {
        setEmail(storedEmail);
    }
    if (storedUserId) {
        setUserId(storedUserId);
        fetchFavoriteTeam();  // Obtener equipo favorito si userId está presente
    } else {
        console.error('userId is not set in session storage');
    }
}, []);
		


	const store = { users, name, email, password, contactoElegido, token, userId, favoriteTeam };
	const actions = { fetchUsers, signUp, deleteUser, singleContact, editUser, setUsers, setEmail, setName, setPassword, logIn, logOut, fetchFavoriteTeam, updateFavoriteTeam };

	return (
		<AppContext.Provider value={{ store, actions }}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;
