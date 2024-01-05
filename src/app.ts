import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import "reflect-metadata";
import { container } from 'tsyringe';
import './_cfg/container.config';
import { errorHandlerMiddleware } from './middleware/error-handler.middleware';
import { RouteConfig } from "./route";
import dotenv from 'dotenv';
import { dbg } from './util/log/debug.log';
import { appProperties } from './_cfg/environment.config';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.options';

dotenv.config();

dbg("Application properties", appProperties)

export const app: Application = express();

const routes = container.resolve(RouteConfig);

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api", routes.configureRoutes());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandlerMiddleware);