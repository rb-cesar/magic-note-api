import dotenv from 'dotenv'

dotenv.config()

import { createApplication } from 'app'

const application = createApplication()

application.start()
