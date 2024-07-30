
import React, { useState } from "react";
import useAppContext from '../store/AppContext'
import { Link, useNavigate } from "react-router-dom";


export const SignUp = () => {
	const { store, actions } = useAppContext();
    const { name, email, password } = store;
	const navigate = useNavigate();

    const handleAddUser = async (name, email, password) => {
        await actions.signUp(name, email, password);
        navigate('/home');
    };

	return (
		<div className="home d-flex align-items-center justify-content-center">
			<div className="log-in-container text-center">
				<div className="mt-5">
					<img src={''} className="w-75" alt="" />
				</div>
				<p className="fs-2 mt-4 text-light">¡Regístrate!</p>
				<p className="text-secondary">Crea una nueva cuenta</p>
				<div>
					<div className="d-flex flex-column justify-content-center gap-4 px-5 mt-5">
						<input type="email" className="form-control" placeholder="Nombre" aria-label="Nombre" aria-describedby="basic-addon1" onChange={(e) => actions.setName(e.target.value)} value={name}/>
						<input type="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1" onChange={(e) => actions.setEmail(e.target.value)} value={email}/>
						<input type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1"  onChange={(e) => actions.setPassword(e.target.value)} value={password}/>
						<button onClick={() => handleAddUser(name, email, password)} className="btn btn-primary fs-3 fw-bolder">Sign up</button>
						<p className="text-secondary pb-5">¿Ya tienes una cuenta? <Link to="/login" className="text-danger fw-bold text-decoration-none">Logueate!</Link></p>
					</div>
				</div>

			</div>

		</div>
	);
};
