import express from "express"
import environment from "./config/environment"
import logger from "morgan"
import errorsMiddleware from './middlewares/errors'
import { serverRoutes, clientRoutes } from './controllers'
import engines from 'consolidate'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
export default class App {
    constructor() {
        this.app = express()
        this.app.engine('hbs', engines.handlebars)
        this.app.set('views', __dirname+'/views')
        this.app.set('view engine', 'hbs')
        this.app.use(cookieParser())
        this.app.use('/js', express.static(__dirname+'/js'))
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(logger('dev', { skip: (req, res) => environment.nodeEnv === 'test' }))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.setRouters()
    }
    setRouters() {
        this.app.use(clientRoutes)
        this.app.use('/api', serverRoutes)
        this.app.use(errorsMiddleware)
    }
    getApp() {
        return this.app
    }
    listen() {
        const { port } = environment
        this.app.listen(port, () => { console.log(`listening at port ${port}`) })
    }
}