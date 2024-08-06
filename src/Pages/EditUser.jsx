import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAppContext from '../store/AppContext'


export const EditUser = () => {
    const { store, actions } = useAppContext();
    const { contactoElegido, token, isAdmin } = store;
    const navigate = useNavigate();

    // Estado local para manejar los datos del formulario
    const [formName, setFormName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [contactId, setContactId] = useState(null);

    useEffect(() => {
        if (contactoElegido) {
            setFormName(contactoElegido.name || '');
            setFormEmail(contactoElegido.email || '');
            setFormPassword(contactoElegido.password || '');
            setContactId(contactoElegido.id); // Asegúrate de tener un ID
        }
    }, [contactoElegido]);

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
        } else {
            navigate('/login');
        }
    }, [token, isAdmin, navigate]);


    const handleChangeName = (e) => setFormName(e.target.value);
    const handleChangeEmail = (e) => setFormEmail(e.target.value);
    const handleChangePassword = (e) => setFormPassword(e.target.value);

    const handleEdit = async (e) => {
        e.preventDefault();
        if (contactId) {
            await actions.editUser(contactId, formName, formEmail, formPassword);
            navigate("/admin");
        } else {
            console.error('No contact ID found');
        }
    };


    return (
        <>
        {isAdmin && (
        <div className="container">
            <h1 className="text-center mb-5 mt-5">Editar Contacto</h1>

            <form className="row g-3" onSubmit={handleEdit}>
                <div className="col-12">
                    <label htmlFor="fullName" className="form-label text-light">Nombre completo</label>
                    <input type="text" className="form-control" name="fullNameContact" onChange={handleChangeName} id="fullName" value={formName} />
                </div>
                <div>
                    <label htmlFor="inputEmail4" className="form-label text-light">Email</label>
                    <input type="email" className="form-control" id="inputEmail4" onChange={handleChangeEmail} value={formEmail} />
                </div>
                <div className="col-12">
                    <label htmlFor="inputPassword4" className="form-label text-light">Password</label>
                    <input type="text" className="form-control" id="inputPassword4" onChange={handleChangePassword} value={formPassword} />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-lg w-100">Guardar</button>
                </div>
            </form>
            <br />
            <Link to="/admin">
                <button className="btn btn-warning">Ver usuarios</button>
            </Link>
        </div>
        )}
        </>
    );
};
