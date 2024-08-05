import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";

import { EditUser } from "./Pages/EditUser";
import { LogIn } from "./Pages/Login";
import { SignUp } from "./Pages/Signup";
import { Admin } from "./Pages/Admin";


//create your first component
const App = () => {

	return (
		<div>
			<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/home" element={<Home />} />
						<Route path="/index.html" element={<Home />} />
						<Route path="/edit_user" element={<EditUser />} />
						<Route path="/login" element={<LogIn />} />
						<Route path="/signup" element={<SignUp />} />
						<Route path="/admin" element={<Admin />} />
					</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
