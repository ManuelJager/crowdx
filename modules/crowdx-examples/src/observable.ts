import { observable, observe } from '../../crowdx/src/api';

const counter = observable(0);

observe(counter, (value) => {
  document.getElementById('counter')!.innerText = 'Counter: ' + value;
})

setInterval(() => {
  counter.set(counter.get() + 1);
}, 1000)
