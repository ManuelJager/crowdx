import { computed, observable, observe } from '../../crowdx/src/api';

const weightInKG = observable(10);

const lbComputed = computed({weightInKG}, ({weightInKG}) => {
  // This will automatically be called when one of the dependency observables is changed (in this case weightInKG)
  return Math.round(weightInKG * 2.20462262 * 100) / 100;
});

// Watches for a change in the value of the weightInKG observable.
observe(weightInKG, weightInKG => {
  document.getElementById('weight-kg')!.innerText = 'KG: ' + weightInKG.toString();
});

// Watches for a change in the value of the lbComputed computed.
observe(lbComputed, weightInLB => {
  document.getElementById('weight-lb')!.innerText = 'LB: ' + weightInLB.toString();
});

document.getElementById('weight-button')!.onclick = () => {
  const value = (document.getElementById('weight-input') as HTMLInputElement)!.value;

  if(parseFloat(value)) {
    weightInKG.set(parseFloat(value))
  }
}
