function getAvailableTime(){
    let currentDate = new Date();
    let correctedHour = currentDate.getHours() + 3;
    currentDate.setHours(correctedHour)
    let minDate = new Date(currentDate).toISOString().slice(0,-8) + ':00';
    let nextYear = currentDate.getFullYear() + 1;
    currentDate.setFullYear(nextYear);
    let maxDate = new Date(currentDate).toISOString().slice(0,-13) + '23:59:00';
    return {minDate, maxDate}
}

export {getAvailableTime}