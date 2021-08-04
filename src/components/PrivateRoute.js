import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ children, authenticated, ...rest }) => {
	if (authenticated) {
		return <Route {...rest}>{children}</Route> 
	} else {
			return <Redirect to='/'/>
	}
};

export default PrivateRoute;