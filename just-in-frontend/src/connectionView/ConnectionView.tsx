import React from "react";
import { RisTripResponseBody } from "../dto/RisTripResponseBody";
import { RisJourneyType } from "../dto/RisJourneyType";
import { TripStatus } from "../dto/TripStatus";

interface ConnectionViewProperties {
    tripId: string;
};

interface ConnectionViewState {
    trip: RisTripResponseBody | null;
    notificationDisplayed: boolean;
};

class ConnectionView extends React.Component<ConnectionViewProperties, ConnectionViewState> {
    constructor(properties: ConnectionViewProperties) {
        super(properties);

        this.state = {
            trip: null,
            notificationDisplayed: false,
        };
    }

    componentDidMount(): void {
        if (this.state.trip === undefined || this.state.trip === null) {
            fetch(
                `http://127.0.0.1:8080/loadJourney/${this.props.tripId}`,
                {
                    method: "GET"
                }
            )
                .then(async (response) => {
                    if (response.status !== 200) {
                        throw new Error(await response.text());
                    }
                    if (this.state.notificationDisplayed === false) {
                        this.displayNotification("Ihr Anschluss von München Hbf nach Salzburg Hbf kann nicht erreicht werden!");
                    }
                    this.setState({
                        ...this.state,
                        trip: await response.json(),
                        notificationDisplayed: true,
                    });
                })
                .catch((exception) => {
                    alert("Fehler beim Laden der Reise!");
                    console.error(exception);
                });
        }
    }

    render() {
        if (this.state?.trip !== undefined && this.state?.trip !== null) {
            return (
                <div className="m-2">
                    <h1>Meine Reise</h1>
                    <p>Reisebeginn: {this.toLocalDateTime(this.state.trip.plannedTripStart)}</p>
                    <p>Ankunftszeit: {this.toLocalDateTime(this.state.trip.plannedTripEnd)}</p>

                    { this.state.trip.legs.map((leg, index) => (
                        leg.type === RisJourneyType.JOURNEY
                            ? (
                                <div key={`leg_journey_${index}`}>
                                    <p>Abfahrt von <strong>{ leg.departure?.stopPlace.name }</strong> auf <strong>Gleis {leg.departure?.platform}</strong> um <strong>{ this.toLocalTime(leg.departure?.time!) }</strong> mit Ankunft in <strong>{ leg.arrival?.stopPlace.name }</strong> auf <strong>Gleis {leg.arrival?.platform}</strong> um <strong>{ this.toLocalTime(leg.arrival?.time!) }</strong></p>
                                    <hr />
                                </div>
                            )
                            : (
                                <div key={`leg_journey_${index}`}>
                                    { leg.evaluation?.status === TripStatus.SAFE ? <p>✅ Anschluss erreichbar</p> : <p>❌ <strong>Anschluss nach {this.state.trip?.legs[index + 1].departure?.stopPlace.name} nicht m&ouml;glich</strong></p> }
                                    <hr />
                                </div>
                            )
                    )) }
                </div>
            )
        } else {
            return (<h1 className="m-2">Reiseinformationen werden aktualisiert...</h1>);
        }
    }

    toLocalTime(dateTimeString: string) {
        return new Date(dateTimeString).toLocaleTimeString("de-at");
    }

    toLocalDateTime(dateTimeString: string) {
        return new Date(dateTimeString).toLocaleString("de-at");
    }

    displayNotification(message: string) {
        if (Notification.permission === "granted") {
            const notification = new Notification(message, { requireInteraction: true });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    const notification = new Notification(message, { requireInteraction: true });
                }
            });
        }
    }
}

export default ConnectionView;
