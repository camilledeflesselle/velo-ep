//Returns an array of boolean values representing
//every possible combination of n binary digits
test = ["classic", "cafe", "burger", "pizza", "sandwich"];
function binaryCombos(n) {
  var result = [];
  for (y = 0; y < Math.pow(2, n); y++) {
    var combo = [];
    for (x = 0; x < n; x++) {
      //shift bit and and it with 1
      if ((y >> x) & 1) combo.push(true);
      else combo.push(false);
    }
    result.push(combo);
  }
  return result;
}

//Usage
combos = binaryCombos(5);

// for(x=0; x<combos.length; x++){
//     console.log(combos[x]);
// }
//console.log(combos.length)
res = [];
for (i = 0; i < combos.length; i++) {
  inter = [];
  for (b = 0; b < combos[i].length; b++) {
    if (combos[i][b]) {
      inter.push(test[b]);
    }
  }
  res.push(inter);
}
console.log(res);
