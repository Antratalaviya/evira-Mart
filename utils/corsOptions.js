const allowedOrigin = [
    'http://localhost:3000',
    'http://localhost:3001'
]

export const corsOptions = {
    origin : allowedOrigin, //allowed origins
    methods : 'GET, POST, PUT, PATCH, DELETE',  //http methods
    credentials : true, // allows credentials to be sent with request (eg, cookies, http authentication) 
    optionsSccessStatus : 204
}

