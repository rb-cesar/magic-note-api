import dotenv from 'dotenv'

dotenv.config()

import { createApplication } from '@app/app'

const application = createApplication()

application.start()
