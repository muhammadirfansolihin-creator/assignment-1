import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
})

// Outgoing request logger per requirement §4.4
apiClient.interceptors.request.use(
    (config) => {
        console.log(`[API] ${config.method.toUpperCase()} ${config.url}`)
        return config
    },
    (error) => Promise.reject(error)
)

// Unified error response handler mapping server states cleanly
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('[API ERROR] No response from server (is the API running?)')
        } else {
            console.error('[API ERROR]', error.message)
        }
        return Promise.reject(error)
    }
)

export const getEmployees = (params ={}) =>
    apiClient.get('/employees', {params})
export const getEmployee = (id) => apiClient.get(`/employees/${id}`)
export const createEmployee = (s) => apiClient.post('/employees', s) 
export const updateEmployee = (id, s) => apiClient.put(`/employees/${id}`, s) 
export const deleteEmployee = (id) => apiClient.delete(`/employees/${id}`)

export default apiClient