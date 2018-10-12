export default async (response, { dataProcessor }, error) => {
    // Handle status code
    const { status } = response

    if (status !== 200) {
        throw response
    }

    // Send request
    try {
        return await response[dataProcessor]()
    } catch (err) {
        error('mhy-redux-fetch-actions'`${ERROR} @response.json()`, err, response)
    }
}