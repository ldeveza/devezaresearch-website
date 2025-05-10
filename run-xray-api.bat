@echo off
echo Setting up DR-API environment and starting the server...

REM Create the conda environment if it doesn't exist
call conda env create -f dr-api-environment.yml --force

REM Activate the environment
call conda activate dr-api

REM Navigate to the API directory
cd model-api\DR-api

REM Run the API server
python app.py

REM If the server exits, don't close the window immediately
pause
