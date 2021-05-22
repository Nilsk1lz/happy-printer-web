# server

![Docker Image CI](https://github.com/happy-printer/server/workflows/Docker%20Image%20CI/badge.svg)

To push to docker:
`docker build -t nilskilz/happy-printer .`
`docker push nilskilz/happy-printer:latest`

To push to own registry:
`docker build -t docker.pidgeonsnest.uk/happy-printer .`
`docker push docker.pidgeonsnest.uk/happy-printer:latest`

## Modules Needed:

- Weather
- Guardian News
- Daily Puzzle
- Word of the day
- Shopping List
- Todo
- Calender events
- IM
