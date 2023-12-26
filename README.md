## Redshift manager

## quick start
```sh
# init
$ conda env create -f environment.yml
$ npm install 

# run
cd frontend; npm start
export REDSHIFT_HOST=
export REDSHIFT_USERNAME=
export REDSHIFT_PASSWORD=
cd backend;
export PYTHONPATH=$PWD
uvicorn main:app --reload
```
