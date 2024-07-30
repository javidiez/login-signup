
import React, { useState } from "react";
import useAppContext from '../store/AppContext'
import { Link, useNavigate } from "react-router-dom";


export const LogIn = () => {
	const { store, actions } = useAppContext();
    const { users, name, email, password } = store;
    const navigate = useNavigate();

	const logIn = async (email, password) => {
		await actions.logIn(email, password);
		navigate('/home');
	}

	return (
		<div className="home d-flex align-items-center justify-content-center">
			<div className="log-in-container text-center">
				<div className="mt-5">
					<img src={''} className="w-75" alt="" />
				</div>
				<p className="fs-2 mt-3 text-light">¡Hola de nuevo!</p>
				<p className="text-secondary">Bienvenido otra vez</p>
				<div>
					<div className="d-flex flex-column justify-content-center gap-4 px-5 mt-4">
						<input type="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1"  onChange={(e) => actions.setEmail(e.target.value)} value={email}/>
						<input type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" onChange={(e) => actions.setPassword(e.target.value)} value={password}/>
						<button onClick={() => logIn(email,password)} className="btn btn-primary fs-3 fw-bolder">Log In</button>
						<p className="text-secondary pb-5">¿No tienes una cuenta? <Link to="/signup" className="text-danger fw-bold text-decoration-none">Regístrate!</Link></p>
					</div>
				</div>

			</div>

		</div>
	);
};
