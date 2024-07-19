export const handleError = async promise => {
    let data, error;
    try {
        data = await promise;
    } catch(err) {
        error = err;
    } finally {
        return { data, error };
    }
}