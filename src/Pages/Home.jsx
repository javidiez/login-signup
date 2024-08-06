import React, { useState, useEffect, useContext } from 'react';
import useAppContext from '../store/AppContext'
import { useNavigate, Link } from 'react-router-dom';

function Home() {
    const { store, actions } = useAppContext();
    const { users, name, token, favoriteTeam, userId, teams, familiarName, familiarType, families, isAdmin } = store;
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

    const handleDeleteFamilyMember = async (id) => {
        await actions.deleteFamilyMember(id);
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
            } else {
                console.error('userId no está disponible en useEffect');
            }
        } else {
            navigate('/login');
        }
    }, [token, userId, isAdmin, navigate]);


    return (
        <>
            {isAdmin && (<Link to='/admin'><button className='btn btn-secondary admin'>Administrador</button></Link>)}
            <button className='btn btn-danger cerrar-sesion' onClick={handlelogOut}>Cerrar sesión</button>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <p className='display-1 text-light mt-5'>Hola {name}</p>
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
                                    <span onClick={() => handleDeleteFamilyMember(familia.id)} class="material-symbols-outlined text-light delete-icon">
                                        delete
                                    </span>
                                </div>
                            ))
                    ) : families && families.length == 0 ? (
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

            </div>
            <h2 className='text-light text-center mt-5'>Agregar familiares</h2>
            <div className='d-flex justify-content-center'>

                <form className='d-flex flex-column w-25' onSubmit={handleAddFamiliar}>
                    <label className='text-light pe-3'>Nombre</label><input type="text" value={familiarName} onChange={(e) => actions.setFamiliarName(e.target.value)} />
                    <label className='text-light pe-3'>Tipo</label>
                    <select
                        value={familiarType}
                        onChange={(e) => actions.setFamiliarType(e.target.value)}
                    >
                        <option className='text-light pe-3' value="">Seleccionar el tipo</option>
                        <option className='text-light pe-3' value="mascota">mascota</option>
                        <option className='text-light pe-3' value="hermano">hermano</option>
                        <option className='text-light pe-3' value="hermana">hermana</option>
                        <option className='text-light pe-3' value="mamá">mamá</option>
                        <option className='text-light pe-3' value="papá">papá</option>
                    </select>
                    <button type='submit' className="btn btn-primary fs-3 fw-bolder mt-4">Añadir familiar</button>
                </form>
            </div>
        </>
    );
}

export default Home;
