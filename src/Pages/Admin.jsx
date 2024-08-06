import React, { useState, useEffect, useContext } from 'react';
import useAppContext from '../store/AppContext'
import { useNavigate, Link } from 'react-router-dom';

export const Admin = () => {
    const { store, actions } = useAppContext();
    const { users, isAdmin, token, userId, totalFamilies, teams, teamName } = store;
    const navigate = useNavigate();

    const handleDeleteUser = async (id) => {
        await actions.deleteUser(id);
    };

    const EditContact = (id) => {
        actions.singleContact(id);
        navigate('/edit_user');
    };

    const handleDeleteFamilyMember = async (id) => {
        await actions.deleteFamilyMemberAdmin(id);
    };

    const handleDeleteTeam = async (id) => {
        await actions.deleteTeam(id);
    };

    const handleAddTeam = async (name) => {
        await actions.addTeams(name);
        actions.setTeamName('')
        navigate('/admin');
    };

    useEffect(() => {
        if (token) {
            if (isAdmin) {
                actions.fetchUsers();
                actions.getFamilies();
                actions.fetchTeams();
            }
            else {
                navigate('/home')
            }
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
            {isAdmin && (
                <>
                    <Link to="/home"><button className='btn btn-primary btn-home'>Home</button></Link>
                    <ul class="nav nav-pills mb-3 mt-5 ms-5" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="btn btn-secondary active me-3" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Usuarios</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn btn-secondary me-3" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Familiares</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn btn-secondary me-3" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Equipos</button>
                        </li>
                    </ul>
                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
                            <h1 className='text-light my-5 ms-5'>Usuarios</h1>
                            <table className='table table-striped table-hover table-dark w-75 ms-5'>
                                <thead>
                                    <tr>
                                        <th className='text-light'>Nombre</th>
                                        <th className='text-light'>Email</th>
                                        <th className='text-light'>Tipo de usuario</th>
                                        <th className='text-light'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <span className='text-light'>{user.name}</span>
                                            </td>
                                            <td>
                                                <span className='text-light'>{user.email}</span>
                                            </td>
                                            <td>
                                                <span className='text-light'>{user.is_admin ? <b>Administrador</b> : <b>Usuario</b>}</span>
                                            </td>
                                            <td className='text-end'>
                                                <span onClick={() => handleDeleteUser(user.id)} className="material-symbols-outlined text-light me-2 delete-icon">
                                                    delete
                                                </span>
                                                <span onClick={() => EditContact(user.id)} className="material-symbols-outlined text-light delete-icon">
                                                    edit
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
                            <h1 className='text-light my-5 ms-5'>Familiares</h1>
                            <table className='table table-striped table-hover table-dark w-75 ms-5'>
                                <thead>
                                    <tr>
                                        <th className='text-light'>Nombre</th>
                                        <th className='text-light'>Tipo</th>
                                        <th className='text-light'>Usuario asociado</th>
                                        <th className='text-light'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {totalFamilies.map(familiar => (
                                        <tr key={familiar.id}>
                                            <td>
                                                <span className='text-light'>{familiar.name}</span>
                                            </td>
                                            <td>
                                                <span className='text-light'>{familiar.type}</span>
                                            </td>
                                            <td>
                                                <span className='text-light'>{familiar.user_name}</span>
                                            </td>
                                            <td className='text-end'>
                                                <span onClick={() => handleDeleteFamilyMember(familiar.id)} className="material-symbols-outlined text-light me-2 delete-icon">
                                                    delete
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">
                            <div className='d-flex align-items-center'>
                                <h1 className='text-light my-5 ms-5'>Equipos</h1>
                                <button type="button" className="btn btn-warning ms-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Añadir
                                </button>
                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Añadir Equipo</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="input-group mb-3">
                                                    <input type="text" className="form-control" placeholder="Equipo" aria-label="Username" aria-describedby="basic-addon1" onChange={(e) => actions.setTeamName(e.target.value)} value={teamName} />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button onClick={() => handleAddTeam(teamName)} type="button" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">Añadir</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className='table table-striped table-hover table-dark w-75 ms-5'>
                                <thead>
                                    <tr>
                                        <th className='text-light'>Nombre</th>
                                        <th className='text-light'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teams.map(equipo => (
                                        <tr key={equipo.id}>
                                            <td>
                                                <span className='text-light'>{equipo.name}</span>
                                            </td>
                                            <td className='text-end'>
                                                <span onClick={() => handleDeleteTeam(equipo.id)} className="material-symbols-outlined text-light me-2 delete-icon">
                                                    delete
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}
