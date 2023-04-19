function some(number){
    const numberArray = number.split('');
    return numberArray.every(character => !isNaN(character))
}

console.log(some('1235435f5345'));
