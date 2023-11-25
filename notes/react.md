### REACT
##### useEffect
makes it possible to perform side effects on renders. runs once every render
```javascript
useEffect(() => {
  //Runs on every render
});
useEffect(() => {
    //Runs only on the first render
}, []);
useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
}, [prop, state]);
```
