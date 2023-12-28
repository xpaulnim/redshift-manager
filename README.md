## Redshift manager

## quick start
```sh
# init
$ conda env create -f environment.yml
$ npm install

# run
cd frontend; npm start;

cd backend/src;
export PYTHONPATH=$PWD;
uvicorn main:app --reload
```
