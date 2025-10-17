const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");
const DBconnection = require("./config/");
const routes = require("./routers");
require("dotenv").config();
const { MONGODB_URI } = process.env;

async function main() {
	try {
		await DBconnection(MONGODB_URI);
		const app = express();
		const port = process.env.PORT || 4433;
		app.use(bodyparser.json());
		app.use(bodyparser.urlencoded({ extended: false }));
		app.use(cors());
		
		// Serve static files (uploaded images)
		app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
		
		// Health check endpoint
		app.get('/api/health', (req, res) => {
			res.json({
				status: 'OK',
				message: 'NutriCare Backend API is running',
				timestamp: new Date().toISOString(),
				version: '1.0.0'
			});
		});
		
		app.use(routes);
		app.listen(port, () => {
			console.log(`listening on http://localhost:${port}`);
		});
	} catch (error) {
		console.log("main:", error);
	}
}

main();
