import React, { useState, useEffect, useContext } from 'react';
import useAppContext from '../store/AppContext'
import { useNavigate } from 'react-router-dom';

function Home() {
    const { store, actions } = useAppContext();
    const { users, name, token, favoriteTeam, userId, teams } = store;  // Asegúrate de tener userId en el estado
    const navigate = useNavigate();

    const handleDeleteUser = async (id) => {
        await actions.deleteUser(id);
    };

    const EditContact = (id) => {
        actions.singleContact(id)
        navigate('/edit_user')
    }

    const handlelogOut = () => {
        actions.logOut()
        navigate('/login')
    }

    const handleTeamChange = (teamId) => {
        actions.updateFavoriteTeam(userId, teamId);
    };

    useEffect(() => {
        if (token) {
            actions.fetchUsers();
            actions.fetchTeams();
            actions.fetchUserDetails();

            if (userId) {
                actions.fetchFavoriteTeam(); // Llamar a fetchFavoriteTeam aquí también
            }
        } else {
            navigate('/login');
        }
    }, [token, userId, navigate]);


    return (
        <>
            <button className='btn btn-danger cerrar-sesion' onClick={handlelogOut}>Cerrar sesión</button>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <p className='display-1 text-light'>Hola {name}</p>
                {favoriteTeam ? (
                    <div className='text-light' key={favoriteTeam.id}>
                        <h2>Tu equipo favorito:</h2>
                        <div className='d-flex gap-4 align-items-baseline justify-content-center' key={favoriteTeam.id}>
                            <p className='text-center'>{favoriteTeam.name}</p>
                        </div>
                    </div>
                ) : (
                    <p className='text-light'>No tienes un equipo favorito asignado</p>
                )}

                <select onChange={(e) => handleTeamChange(e.target.value)} value={userId.favorite_team_id || ''}>
                    <option value="">Seleccionar equipo</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>
                <h1 className='text-light'>Usuarios</h1>
                <ul>
                    {users.map(user => (
                        <li key={user.id} className='d-flex align-items-center mt-4'>
                            <span className='text-light pe-4'>{user.name} - {user.email} - {user.password}</span>
                            <button className={favoriteTeam?.name == "Ferro" ? 'btn btn-success me-3' : favoriteTeam?.name == "River Plate" ? 'btn btn-danger me-3' : 'btn btn-warning me-3'} onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                            <button className={favoriteTeam?.name == "Ferro" ? 'btn btn-success' : favoriteTeam?.name == "River Plate" ? 'btn btn-danger' : 'btn btn-primary'} onClick={() => EditContact(user.id)}>Editar</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Home;
