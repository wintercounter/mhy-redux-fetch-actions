const SUCCESS_SUBFIX = '@success'
const PENDING_SUBFIX = '@pending'
const ERROR_SUBFIX = '@error'

const error = msg => {
    if (process.env.NODE_ENV === 'development') {
        console.error(msg)
    }
}

const config = {
    handleResponse: () => {},
    dataProcessor: 'json',
}

export const globalSetup = (overrides = {}) => Object.assign(config, overrides)

export default function(domain, endpoint, settings) {
    const SUCCESS = `${domain}${SUCCESS_SUBFIX}`
    const PENDING = `${domain}${PENDING_SUBFIX}`
    const ERROR = `${domain}${ERROR_SUBFIX}`
    settings = Object.assign(config, settings)

    const fn = dispatch => async (...props) => {
        dispatch({
            type: PENDING,
            props
        })
        try {
            const { handleResponse } = settings

            // Make request happen
            const response = await endpoint(...props)

            // Make possible to handle custom structures
            const payload = handleResponse(response, settings, error)

            // Everything was fine, handler didn't throw any error
            dispatch({
                type: SUCCESS,
                payload,
                props
            })
            return payload
        } catch (response) {
            error('mhy-redux-fetch-actions'`${ERROR} @response.json()`, err)

            const { status } = response
            const data = await response.json()
            dispatch({
                type: ERROR,
                props
            })
            return {
                status,
                ...data
            }
        }
    }
    fn.SUCCESS = SUCCESS
    fn.PENDING = PENDING
    fn.ERROR = ERROR
    return fn
}
