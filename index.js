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
		const port = process.env.PORT || 8080;
		app.use(bodyparser.json());
		app.use(bodyparser.urlencoded({ extended: false }));
		app.use(cors());
		
		// Serve static files (uploaded images)
		app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
		
		// Health check endpoint
		app.get('/health', (req, res) => {
			res.json({
				status: 'OK',
				message: 'NutriCare Backend API is running',
				timestamp: new Date().toISOString(),
				version: '1.0.0'
			});
		});

		// Seeder endpoint
		app.get('/seeders/master', async (req, res) => {
			try {
				console.log('Starting master seeder...');
				
				// Import seeder modules
				const adminSeeder = require('./seeders/admin.seeder');
				const userSeeder = require('./seeders/user.seeder');
				const foodSeeder = require('./seeders/food.seeder');
				const diseaseSeeder = require('./seeders/diseaseTemplate.seeder');
				const weeklySeeder = require('./seeders/weeklyPlan.seeder');

				// Run all seeders
				await adminSeeder();
				await userSeeder();
				await foodSeeder();
				await diseaseSeeder();
				await weeklySeeder();

				res.json({
					status: 'success',
					message: 'Master seeder completed successfully',
					timestamp: new Date().toISOString(),
					data: {
						admins: '1 admin created',
						users: '10 sample users created',
						foods: '50+ foods created',
						diseaseTemplates: '5+ templates created',
						weeklyPlans: 'Sample plans created'
					}
				});
			} catch (error) {
				console.error('Seeder error:', error);
				res.status(500).json({
					status: 'error',
					message: 'Seeder failed',
					error: error.message
				});
			}
		});
		
		// Use routes without /api prefix (for consistency with existing frontend)
		app.use(routes);
		app.listen(port, () => {
			console.log(`listening on http://localhost:${port}`);
		});
	} catch (error) {
		console.log("main:", error);
	}
}

main();
