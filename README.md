## Redshift manager

## quick start
```sh
# init
$ conda env create -f environment.yml
$ npm install

# run
cd frontend; npm start
# either
export REDSHIFT_HOST=
export REDSHIFT_USERNAME=
export REDSHIFT_PASSWORD=
# or
export POSTGRES_HOST=
export POSTGRES_PORT=  # 5432 by default
export POSTGRES_USERNAME=
export POSTGRES_PASSWORD=
cd backend/src;
export PYTHONPATH=$PWD
uvicorn main:app --reload
```
