// Packages

const fetchData = async (apiLink) => {
    try {
        const response = await fetch(apiLink);
        const contentType = response.headers.get('content-type');
        const data = contentType.includes('application/json')
            ? await response.json()
            : await response.text();

        if (typeof data === 'object' && data.status === 'OK') {
            return data.result;
        }
        return null;
    } catch (err) {
        return null;
    }
};

module.exports = {
    fetchData
};