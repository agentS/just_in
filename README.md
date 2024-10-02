# Just-In

Just-In is a solution that provides relevant and timely information about the impact of a delay to a user.
In other words, it tells a user if she or he will arrive on time and what to do in case of a delay.

## Application Flow

The user is able to register for journey updates using the booking code.

![Form for registering for updates using the booking code](documentation/registrationBookingCode.png)

The user is able to register for journey updates using the connection search.

![Form for registering for updates using the booking search](documentation/registrationConnectionSearch.png)

A user is informed about delays and if she or he can reach each connecting train.

![View providing updates to the user](documentation/connectionView.png)

### Web Front End

## Architecture

We designed an interoperable structure that allows plugging in several front ends and back ends.

The Just-In web frontend REST API provides an easy API that can be embedded in mobile applications, such as [SBB Mobile](https://www.sbb.ch/en/travel-information/apps/sbb-mobile.html), [DB Navigator](https://www.bahn.de/service/mobile/db-navigator) or [ÖBB Scotty](https://www.oebb.at/de/fahrplan/fahrplanauskunft/scottymobil).
Furthermore, we provide a web frontend that can be embedded as a web view.

The back end defines a unified API that allows connecting a railway operator's solution into a European-wide application.

In addition, a user's bookings can be imported into the notification service via our uniform interface. This allows a user to view delays and updates without any interaction no matter with which railway operator they made the booking with.
The railway operator's ticketing system just imports the booking details into Just-In and the user doesn't have to do anything else but to open the web site.

![Sketch of the architecture](documentation/architecture.svg)

