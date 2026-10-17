# transit.lapius7.com

[日本語](README.ja.md)

Source code of [transit.lapius7.com](https://transit.lapius7.com), a route search web app for public transport in Japan. It is built with Next.js (App Router), TypeScript and Tailwind CSS, and calls the [Transit API](https://api.transit.ls8h.com/api/docs) directly from the browser. This repository is published for reference and is not meant to be self-hosted.

## Features

- Autocomplete search for stations, bus stops, facilities and addresses
- Route search with departure, arrival, first train and last train modes, via points, transfer limits and walking avoidance
- Route details with transfer steps, fares and service notices
- Search from the current location
- Station details and departure timetables
- List of data providers

## Data

Route and timetable information is based on open data from transit operators, aggregated by the Transit API. It may differ from actual service. The data providers are listed in the footer of the app.

## License

[MIT](./LICENSE)
