#!/bin/bash
echo "Starting CSV import..."

mongoimport --db safer --collection accidents --type csv --file /csv/merged.csv --headerline --authenticationDatabase admin --username=root --password=root

echo "CSV import completed."
