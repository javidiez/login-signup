import React, { useState, useEffect, useContext } from 'react';
import useAppContext from '../store/AppContext'
import { useNavigate } from 'react-router-dom';

function Home() {
    const { store, actions } = useAppContext();
    const { users, name, token, favoriteTeam, userId } = store;  // Asegúrate de tener userId en el estado
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

    useEffect(() => {
        if (token) {
            actions.fetchUsers();
            if (userId) {
                actions.fetchFavoriteTeam(); // Llamar a fetchFavoriteTeam aquí también
            }
        } else {
            navigate('/login');
        }
    }, [token, userId]);


    return (
        <>
            <button className='btn btn-danger cerrar-sesion' onClick={handlelogOut}>Cerrar sesión</button>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <p className='display-1 text-light'>Hola {name}</p>
                {favoriteTeam ? (
                                <div className='text-light'>
                                    <h2>Tu equipo favorito:</h2>
                                    <p className='text-center'>{favoriteTeam.name}</p>
                                </div>
                            ) : (
                                <p className='text-light'>No tienes un equipo favorito asignado</p>
                            )}
                <h1 className='text-light'>Usuarios</h1>
                <ul>
                    {users.map(user => (
                        <div className='d-flex align-items-center mt-4' key={user.id}>
                            <li className='text-light pe-4'>{user.name} - {user.email} - {user.password}</li>
                            <button className='btn btn-warning me-3' onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                            <button className='btn btn-primary' onClick={() => EditContact(user.id)}>Editar</button>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Home;
