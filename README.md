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

## Notes & troubleshooting

- API URIs are stored in `src/constants.ts`
- CasaBus API returns wrong/missing data between `22:00 GMT+1` - `04:00 GMT+1`(? not sure about 4AM). I have no clue why
- CasaTramway RoutePlanner API might throw 403 randomly, simply re-run the method and it will work

## Contributing

- Contributions are welcome! Just open a PR detailing what's been modified and I'll take a look at it!

## License & contact

This project is licensed under the Apache 2.0 License. For questions or help, open an issue in this repository.
