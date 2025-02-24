import { app } from "./index";
import { connectDB } from './config/db.js';
import { eventLogger } from "./utils/logger/logger";

app.listen(3000, () => {
    eventLogger.info('Server running on port 3000');
    connectDB();
});