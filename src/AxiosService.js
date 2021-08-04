import axios from 'axios'

console.log("Axios Service Base_Api",window.$base_api);

export default axios.create({
    baseURL: 'https://watchtradebackend.herokuapp.com',
    // baseURL: 'http://localhost:5000',
    // timeout: 1000,
    headers: {
        'Content-Type'  : 'application/x-www-form-urlencoded',
        'Authorization' : 'Bearer '+localStorage.getItem("accessToken")
    }
});