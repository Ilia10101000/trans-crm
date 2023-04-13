try {
    let i = 4;
    try {
        throw new Error('error')
    } catch (error) {
        console.log('deep, ', error.message)
    }
} catch (error) {
    console.log('up, ', error.message)
}