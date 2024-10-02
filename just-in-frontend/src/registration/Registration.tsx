import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { RegistrationMethod } from "./RegistrationMethod";
import { BACKEND_BASE_URL } from "../Constants";

interface RegistrationProperties {
    onRegistered: (tripId: string) => void;
};

interface RegistrationState {
    inputMethod: RegistrationMethod,
    bookingCode: string,
    registrationInProgress: boolean,
    departureStationName: string,
    arrivalStationName: string,
    departureDateTime: string,
};

class Registration extends React.Component<RegistrationProperties, RegistrationState> {
    constructor(properties: RegistrationProperties) {
        super(properties);

        this.state = {
            inputMethod: RegistrationMethod.CONNECTION_SEARCH,
            bookingCode: "2117 0964 8046 2693",
            registrationInProgress: false,
            departureStationName: "Berlin Hbf",
            arrivalStationName: "Ostermiething",
            departureDateTime: "01.10.2024 14:03",
        };
    }

    render() {
        if (!this.state.registrationInProgress) {
            return (
                <div className="m-2">
                    <h1>F&uuml;r Reisebenachrichtungen registrieren</h1>
                    <Form onSubmit={() => this.setState({ ...this.state, registrationInProgress: true })}>
                        <Form.Group>
                            <Form.Check type="radio" checked={this.state.inputMethod === RegistrationMethod.BOOKING_CODE} name="input_method" id={RegistrationMethod.BOOKING_CODE} inline label="Buchungscode" onChange={() => this.setState({ ...this.state, inputMethod: RegistrationMethod.BOOKING_CODE })} />
                            <Form.Check type="radio" checked={this.state.inputMethod === RegistrationMethod.CAMERA} name="input_method" id={RegistrationMethod.CAMERA} inline label="Scann mittels Kamera" onChange={() => this.setState({ ...this.state, inputMethod: RegistrationMethod.CAMERA })} />
                            <Form.Check type="radio" checked={this.state.inputMethod === RegistrationMethod.CONNECTION_SEARCH} name="input_method" id={RegistrationMethod.CONNECTION_SEARCH} inline label="Verbindungssuche" onChange={() => this.setState({ ...this.state, inputMethod: RegistrationMethod.CONNECTION_SEARCH })} />
                        </Form.Group>
                        {
                            this.state.inputMethod === RegistrationMethod.CONNECTION_SEARCH
                                ? (
                                    <div>
                                        <Form.Group>
                                            <Form.Label>Abfahrtsbahnhof</Form.Label>
                                            <Form.Control type="text" placeholder="Berlin Hbf"
                                                value={this.state.departureStationName} onChange={(event) => this.setState({ ...this.state, departureStationName: event.currentTarget.value })} />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Ankunftsbahnhof</Form.Label>
                                            <Form.Control type="text" placeholder="Ostermiething"
                                                value={this.state.arrivalStationName} onChange={(event) => this.setState({ ...this.state, arrivalStationName: event.currentTarget.value })} />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Abfahrtszeit</Form.Label>
                                            <Form.Control type="text" placeholder="Ostermiething"
                                                value={this.state.departureDateTime} onChange={(event) => this.setState({ ...this.state, departureDateTime: event.currentTarget.value })} />
                                        </Form.Group>
                                    </div>
                                )
                                : (
                                    <Form.Group>
                                        <Form.Label>Buchungscode</Form.Label>
                                        <Form.Control type="text" placeholder="2117 0964 8046 2693"
                                            value={this.state.bookingCode} onChange={(event) => this.setState({ ...this.state, bookingCode: event.currentTarget.value })} />
                                        <Form.Text className="text-muted">Der Buchungscode hat 16 Ziffern und besteht aus vier Gruppen zu je vier Ziffern</Form.Text>
                                    </Form.Group>
                                )
                        }
                        
                        <Form.Group className="mt-2">
                            <Button variant="primary" type="submit">Reisebenachrichtungen erhalten</Button>
                        </Form.Group>
                    </Form>
                </div>
            );
        } else {
            fetch(
                `${BACKEND_BASE_URL}/registerJourney/8011160/8102067/2024-10-01T06:26:00Z`,
                {
                    method: "POST",
                }
            ).then(async (response) => {
                if (response.status !== 200) {
                    throw new Error(await response.text());
                }
                const responseBody = await response.json();
                const tripId = responseBody.tripID;
                window.sessionStorage.setItem("tripId", tripId);
                this.props.onRegistered(tripId);
            }).catch((exception) => {
                alert("Beim Laden der Reiseupdates ist ein Fehler aufgetreten");
                console.error(exception);
            });
            return (<h1 className="m-2">Gleich geht's los!</h1>);
        }
    }
}

export default Registration;
