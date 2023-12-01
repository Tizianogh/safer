# syntax=docker/dockerfile:1.4
FROM python:3.10-slim AS builder

WORKDIR /src
COPY requirements.txt /src

RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

COPY . .

CMD ["python3", "server.py"]
