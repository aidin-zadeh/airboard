
# airboard

## Background

## Methodology

## Data
- [T-100 Domestic Market (All Carriers)](https://www.transtats.bts.gov/DL_SelectFields.asp): This table contains domestic market data reported by both U.S. and foreign air carriers, including carrier, origin, destination, and service class for enplaned passengers, freight and mail when both origin and destination airports are located within the boundaries of the United States and its territories. For a uniform end date for the combined databases, the last 3 months U.S. carrier domestic data released in T-100 Domestic Market (U.S. Carriers Only) are not included.
- [Master Coordinate](https://www.transtats.bts.gov/DL_SelectFields.asp): This table contains historical (time-based) information on airports used throughout the aviation databases. It provides a list of domestic and foreign airport codes and their associated world area code, country information, state information (if applicable), city name, airport name, city market information, and latitude and longitude information.
- [On-Time Performance](https://www.transtats.bts.gov/TableInfo.asp): This table contains on-time arrival data for non-stop domestic flights by major air carriers, and provides such additional items as departure and arrival delays, origin and destination airports, flight numbers, scheduled and actual departure and arrival times, cancelled or diverted flights, taxi-out and taxi-in times, air time, and non-stop distance.
## Report

## Requirements

flask           1.0.2
numpy           1.15.0
pandas          0.23.4
jupyter         1.0.0
notebook        5.6.0
nb_conda        2.2.1
sqlalchemy      1.2.10

## Directory Structure
```
.
├── docs                <- Documents related to this project
├── images              <- Images for README.md files
├── notebooks           <- Ipythoon Notebook files
├── reports             <- Generated analysis as HTML, PDF, Latex, etc.
│   ├── figures         <- Generated graphics and figures used in reporting
│   └── logs            <- Generated log files  
└── airboard
    ├── conf
    ├── data            <- data utilized in this project
    │   ├── ext
    │   ├── int
    │   └── raw
    ├── src             <- Source files used in this project
    ├── static          <- CSS/SCSS/JS/Vedoer source files
    └── templates       <- Flask templates 
```
## Installation
Install python dependencies from  `requirements.txt` using conda.
```bash
conda install --yes --file conda-requirements.txt
```

Or create a new conda environment `<new-env-name>` by importing a copy of a working conda environment at the project root directory :`conda-airboard.yml`.
```bash
conda env create --name <new-env-name> -f conda-airboard.yml
```
## Usage
```bash
python run.py
```
## References
- [Bureau of Transportation Statistics](https://www.bts.gov/)

## To Do
- [ ] TBA

## License
MIT License

