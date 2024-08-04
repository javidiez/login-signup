import React, { useState, useEffect, useContext } from 'react';
import useAppContext from '../store/AppContext'
import { useNavigate } from 'react-router-dom';

function Home() {
    const { store, actions } = useAppContext();
    const { users, name, token, favoriteTeam, userId, teams, familiarName, familiarType, families } = store;
    const navigate = useNavigate();

    const handleAddFamiliar = async (e) => {
        e.preventDefault();

        if (!familiarName || !familiarType) {
            console.error("Name and type are required");
            return;
        }

        await actions.addFamilyMember(userId, familiarName, familiarType);
        actions.setFamiliarName('');
        actions.setFamiliarType('');
        actions.getFamilyMembers(userId);
        navigate('/home')
    };

    const handleDeleteUser = async (id) => {
        await actions.deleteUser(id);
    };


    const handleDeleteFamilyMember = async (id) => {
        await actions.deleteFamilyMember(id);
    };

    const EditContact = (id) => {
        actions.singleContact(id);
        navigate('/edit_user');
    };

    const handlelogOut = () => {
        actions.logOut();
        navigate('/login');
    };

    const handleTeamChange = (teamId) => {
        actions.updateFavoriteTeam(userId, teamId);
    };

    useEffect(() => {
        if (token) {
            actions.fetchUsers();
            actions.fetchTeams();
            actions.fetchUserDetails();
            actions.getFamilyMembers();

            if (userId) {
                actions.fetchFavoriteTeam();
                console.log('Guardando el userId: ' + userId);
            } else {
                console.error('userId no está disponible en useEffect');
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
                <h2 className='text-light'>Tu familia es:</h2>
                <ul>
                    {families && families.length > 0 ? (
                        families
                            .filter(familia => familia.user_id == userId)
                            .map(familia => (
                                <div className='d-flex gap-3 py-1' key={familia.id}>
                                    <li className='text-light'>
                                        Tu familiar se llama {familia.name} y es tu {familia.type}
                                    </li>
                                    <button onClick={() => handleDeleteFamilyMember(familia.id)} className='btn btn-primary'>Eliminar</button>
                                </div>
                            ))
                    ) : families.length == 0 ? (
                        <li className='text-light'>No tienes familia</li>
                    ) : 'Error al cargar la lista de familiares'}
                </ul>

                {favoriteTeam ? (
                    <div className='text-light' key={favoriteTeam.id}>
                        <h2>Tu equipo favorito:</h2>
                        <div className='d-flex gap-4 align-items-baseline justify-content-center'>
                            <p className='text-center'>{favoriteTeam.name}</p>
                        </div>
                    </div>
                ) : (
                    <p className='text-light'>No tienes un equipo favorito asignado</p>
                )}

                <select onChange={(e) => handleTeamChange(e.target.value)} value={favoriteTeam?.id || ''}>
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
                            <button className={favoriteTeam?.name === "Ferro" ? 'btn btn-success me-3' : favoriteTeam?.name === "River Plate" ? 'btn btn-danger me-3' : 'btn btn-warning me-3'} onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                            <button className={favoriteTeam?.name === "Ferro" ? 'btn btn-success' : favoriteTeam?.name === "River Plate" ? 'btn btn-danger' : 'btn btn-primary'} onClick={() => EditContact(user.id)}>Editar</button>
                        </li>
                    ))}
                </ul>
            </div>
            <form className='d-flex flex-column' onSubmit={handleAddFamiliar}>
                <label className='text-light pe-3'>Nombre</label><input type="text" value={familiarName} onChange={(e) => actions.setFamiliarName(e.target.value)} />
                <label className='text-light pe-3'>Tipo</label><input type="text" value={familiarType} onChange={(e) => actions.setFamiliarType(e.target.value)} />
                <button type='submit' className="btn btn-primary fs-3 fw-bolder">Añadir familiar</button>
            </form>
        </>
    );
}

export default Home;
