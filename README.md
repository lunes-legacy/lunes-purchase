# Ryanair FE Test 

## Development

Create a JS bundle with Webpack::

  $ npm run build

Start the Webpack development server on 'localhost:3000'::

  $ npm run start

Run tests::

  $ npm run test

Linting::

  $ npm run lint


## Tasks

Build a small web app that will find the cheapest flights around Europe.
Show us the best that you can do.
The webapp needs to have at least the following components:

### Styling

Apply a styleguide following the Ryanair branding ( colors )

### Components

#### AirportSelector

An airport selector which will display the list of airports and allow the user
to select an aiport.

Keep in mind that origin is different from destination but the component needs to
be reusable for both scenarios.

The component needs to be a custom select with autocomplete support.

Keep in mind that departure will have only some routes defined not all the
airports can reach other airports.

#### Flight List

A component that will show all the information relative to the flights between the
origin and destination selected.

Requirements:

* OneWay Dataflow

Extra points will be given for:

* Styling
* Mobile first design
* No third party libraries

### Services

In order to get the list of Iata codes ( airport codes )  with the relative destinations
the webapp will get those information from the following API:

```
https://murmuring-ocean-10826.herokuapp.com/en/api/2/forms/flight-booking-selector/
```

Instead to get the list of cheap flights:

```
https://murmuring-ocean-10826.herokuapp.com/en/api/2/flights/from/DUB/to/STN/2014-12-02/2015-02-02/250/unique/?limit=15&offset-0
```

where DUBis the originating IATA code, STNis the destination IATA code,
the first date range is the start of the period, and the second is the end.

### Routing

The flight list page needs to be a child route of the home page, the search widget
needs to be accessibile even after a search

The flight list page needs to be deep linked, so i can share the URL and access
directly the flights that i'm looking for.

### Refactor

The `DateWrapper` and `DateSelector` component is not using a one-way dataflow approach
refactor the component using that dataflow avoiding two way binding
between the two

### Unit Testing ( not mandatory )

Extra points will be given for unit testing all the functionality written.

## Workflow

* Fork the project on gitlab
* Do your magic
* Share your fork with @fortunatof_ryanair ( Reporter access )
