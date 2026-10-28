# CasaTransport-GTFS

GTFS exporter for buses and tramways using CasaBus/CasaTramway APIs respectively.

This repository contains two main GTFS exporters:

- `CasaBusGTFS` — exports bus data and builds GTFS files from CasaBus endpoints.
- `CasaTramwayGTFS` — exports tramway/busway data using CasaTramway endpoints and route planning data.

## Quick start

- Ensure the API is available. [See Notes & troubleshooting](#notes--troubleshooting).
- Run the export methods for both classes (`deno run --allow-all --env-file main.ts`)

## GTFS methods

Each class inherits `GTFSExporter`, which is an abstract class with `getGTFS[X]` methods where `[X]` is the name of a GTFS file. These methods return GTFS-compliant CSV files.

## Outputs

- `gtfs-bus/`: Casabus (Alsa) feed
- `gtfs-tramway/`: Casatramway and Casabusway feed
- `gtfs-casablanca/`: both feeds merged, with ids prefixed `bus:` and `tram:`, parent stations
  (same-name platforms within 100 m) and walking transfers (tram or busway stop to any stop within
  400 m)
- `gtfs-rt/alerts.pb`: GTFS-Realtime service alerts from Casabus live incidents
  (`deno run --allow-all --env-file main.ts --alerts`)

## Data sources and assumptions

| Data | Source | Status |
|---|---|---|
| Tram and busway travel times | Casatramway route planner, terminal to terminal, spread over stops by distance | intermediate stops approximate (`timepoint=0`) |
| Tram and busway fare, 8 MAD | [casatramway.ma/ticket-abonnement/nos-offres](https://www.casatramway.ma/ticket-abonnement/nos-offres) | official |
| 30 minute tram/busway transfer window | press coverage of the busway launch (Medias24, 2024) | not on the operator site |
| Bus fares per line | [casabus.ma/titres-de-transport/tarifs](https://www.casabus.ma/titres-de-transport/tarifs/) | official; L302 and L308 not listed |
| Bus payment on board, no free bus transfers | none | assumption |
| Bus holidays follow the Sunday timetable | none | assumption, as on the tramway |
| Walking time for transfers | straight line x 1.3 at 1.2 m/s | approximation |

## Notes & troubleshooting

- API URIs are stored in `src/constants.ts`
- CasaBus API returns wrong/missing data between `22:00 GMT+1` - `04:00 GMT+1`(? not sure about 4AM). I have no clue why
- CasaTramway RoutePlanner API might throw 403 randomly, simply re-run the method and it will work

## Contributing

- Contributions are welcome! Just open a PR detailing what's been modified and I'll take a look at it!

## License & contact

This project is licensed under the Apache 2.0 License. For questions or help, open an issue in this repository.
