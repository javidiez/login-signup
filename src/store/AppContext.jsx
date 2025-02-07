import { useContext, createContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [users, setUsers] = useState([]);
	const [teams, setTeams] = useState([]);
	const [families, setFamilies] = useState([]);
	const [contactoElegido, setContactoElegido] = useState({})
	const [name, setName] = useState('');
	const [email, setEmail] = useState(sessionStorage.getItem('email') || '');
	const [password, setPassword] = useState('');
	const [token, setToken] = useState(sessionStorage.getItem('token') || '')
	const [favoriteTeam, setFavoriteTeam] = useState(null);
	const [userId, setUserId] = useState(sessionStorage.getItem('userId') || ''); // Estado para userId
	const [teamId, setTeamId] = useState(sessionStorage.getItem('teamId') || '');
	const [teamName, setTeamName] = useState('');
	const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('isAdmin') || '');
	const [familiarName, setFamiliarName] = useState('');
	const [familiarType, setFamiliarType] = useState('');
	const [totalFamilies, setTotalFamilies] = useState([]);


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

	const fetchUserDetails = async () => {
		if (!userId) {
			console.error('User ID is not available');
			return;
		}
		try {
			const response = await fetch(`http://127.0.0.1:5000/users/${userId}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			setName(data.name);
			setEmail(data.email);
		} catch (error) {
			console.error('There was an error fetching the user details!', error);
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

	const deleteFamilyMember = async (id) => {
		try {
			const response = await fetch(`http://127.0.0.1:5000/family/delete/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`Network response was not ok ${response.statusText}`);
			}

			// Actualiza el estado de la lista de usuarios después de eliminar
			setFamilies(families.filter(member => member.id !== id));

			console.log('Family member deleted successfully');
		} catch (error) {
			console.error('There was an error deleting the member:', error);
		}
	};

	const deleteFamilyMemberAdmin = async (id) => {
		try {
			const response = await fetch(`http://127.0.0.1:5000/family/delete/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`Network response was not ok ${response.statusText}`);
			}

			// Actualiza el estado de la lista de usuarios después de eliminar
			setTotalFamilies(totalFamilies.filter(member => member.id !== id));

			console.log('Family member deleted successfully');
		} catch (error) {
			console.error('There was an error deleting the member:', error);
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

				// Guardar el token en sessionStorage
				sessionStorage.setItem('token', data.token);
				sessionStorage.setItem('name', data.name);
				sessionStorage.setItem('email', data.email);
				sessionStorage.setItem('userId', data.userId);  // Guardar userId
				sessionStorage.setItem('isAdmin', data.is_admin ? 'true' : 'false'); // Guardar is_admin como string 'true' o 'false'
				setToken(data.token);
				setName(data.name);
				setEmail(data.email);
				setUserId(data.userId);
				setFavoriteTeam(data.favoriteTeam)
				setIsAdmin(data.is_admin ? true : false); // Asegúrate de que sea booleano
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
			console.log("Data guardada:" + data.name);
		} catch (error) {
			console.error('There was an error fetching the favorite team!', error);
		}
	};

	const fetchTeams = async () => {
		try {
			const response = await fetch('http://127.0.0.1:5000/teams');

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setTeams([...data]);
		} catch (error) {
			console.error('There was an error fetching the users!', error);
		}
	};

	const addTeams = async () => {
		try {
		  console.log('Adding team with name:', teamName); // Verifica el valor aquí
		  
		  const response = await fetch('http://127.0.0.1:5000/teams/add', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  name: teamName
			}),
		  });
	  
		  if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		  }
	  
		  const data = await response.json();
		  if (data) {
			setTeams(prevTeams => [...prevTeams, data]);
			setTeamName(data.name);
		  } else {
			console.error("Error al añadir el equipo:", data);
		  }
		} catch (error) {
		  console.error("Network error:", error);
		}
	  };
	  

	const deleteTeam = async (id) => {
		try {
			const response = await fetch(`http://127.0.0.1:5000/team/delete/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`Network response was not ok ${response.statusText}`);
			}

			// Actualiza el estado de la lista de usuarios después de eliminar
			setTeams(teams.filter(team => team.id !== id));

			console.log('Team deleted successfully');
		} catch (error) {
			console.error('There was an error deleting team:', error);
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
			fetchFavoriteTeam();
		} catch (error) {
			console.error('There was an error updating the favorite team:', error);
		}
	};

	const addFamilyMember = async (userId, name, type) => {
		if (!userId || !name || !type) {
			console.error("User ID, name, and type are required");
			return;
		}
		try {
			const response = await fetch(`http://127.0.0.1:5000/family/${userId}/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, type }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			if (data && data.id) {
				setFamilies((prevFamilies) => [...prevFamilies, data]);
			} else {
				console.error("Unexpected response format:", data);
			}
		} catch (error) {
			console.error("Network error:", error);
		}
	};

	const getFamilyMembers = async () => {

		if (!userId) {
			console.error('User ID is not available');
			return;
		}
		try {
			const response = await fetch(`http://127.0.0.1:5000/user/${userId}/members`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			setFamilies(data);
		} catch (error) {
			console.error('There was an error fetching the user details!', error);
		}
	};
	
	const getFamilies = async () => {
		try {
			const response = await fetch('http://127.0.0.1:5000/families');

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setTotalFamilies([...data]);
		} catch (error) {
			console.error('There was an error fetching the users!', error);
		}
	};

	useEffect(() => {
		const storedToken = sessionStorage.getItem('token');
		const storedUserId = sessionStorage.getItem('userId');
		const storedIsAdmin = sessionStorage.getItem('isAdmin') === 'true';

		if (storedToken) {
			setToken(storedToken);
		}

		if (storedUserId) {
			setUserId(storedUserId);
			fetchUserDetails(storedUserId); // Fetch user details if userId is available
			fetchFavoriteTeam(storedUserId); // Obtener equipo favorito si userId está presente
			setIsAdmin(storedIsAdmin); // Configurar el estado con el valor booleano
			getFamilies();
		} else {
			console.error('userId is not set in session storage');
		}
	}, []);




	const store = { users, name, email, password, contactoElegido, token, userId, favoriteTeam, teamId, teams, families, familiarType, familiarName, isAdmin, totalFamilies ,teamName };
	const actions = { fetchUsers, signUp, deleteUser, singleContact, editUser, setUsers, setEmail, setName, setPassword, logIn, logOut, fetchFavoriteTeam, fetchTeams, updateFavoriteTeam, fetchUserDetails, addFamilyMember, setFamiliarName, setFamiliarType, getFamilyMembers, deleteFamilyMember, getFamilies, deleteFamilyMemberAdmin, addTeams, deleteTeam, setTeamName };

	return (
		<AppContext.Provider value={{ store, actions }}>
			{children}
		</AppContext.Provider>
	);
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;
