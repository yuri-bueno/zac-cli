import { appCore } from 'zac-api'

import formatParams from './middlewares/formatParams';

import auth from './middlewares/auth';

import multer from './middlewares/multer';


new appCore({ port: 3000,
 cors: {}  , middlewares: [formatParams, auth, multer]

 }).init()
