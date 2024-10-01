import React from "react";
import Registration from "./registration/Registration";
import ConnectionView from "./connectionView/ConnectionView";
import "bootstrap/dist/css/bootstrap.min.css";

interface ApplicationState {
	tripId: string | null;
};

export class Application extends React.Component<{}, ApplicationState> {
	constructor(properties: {}) {
		super(properties);

		const storedTripId = window.sessionStorage.getItem("tripId");
		if (storedTripId !== undefined && storedTripId !== null && storedTripId !== "") {
			this.state = {
				tripId: storedTripId, 
			};
		} else {
			this.state = {
				tripId: null, 
			};
		}
	}

	render() {
		if (this.state?.tripId !== undefined && this.state?.tripId !== null && this.state?.tripId !== "") {
			return (
				<ConnectionView tripId={this.state.tripId} />
			); 
		} else {
			return (
				<Registration onRegistered={(tripId) => this.setState({ ...this.state, tripId })} />
			);
		}
	}
}

export default Application;
