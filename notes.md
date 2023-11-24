### REDUX
##### redux action
a plain javascript object that has a type field
conceptually, it is an event that describes something that happened in an app
```javascript
redux_action = {
    type: "hello world"
}
```

##### action creator
a function that creates an action object
```javascript
const paintCar = (color) => {
    return {
        type: 'PAINT_CAR',
        value
    }
}
```

#### thunk
a function that does some work
typically written in slice files


#### slice
createSlice generates an action creator for every reducer function defined in reducers field
and the generated action type includes the name of the slice
`extraReducers`param in `createSlice()` allows the slice reducer to response to actions not defined as part of the slice's
reducers field
