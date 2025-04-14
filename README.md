# IW Developer Skills Assessment

## Setup Instructions

1. **Clone the repository and install dependencies**:
   
   ```bash
   git clone https://github.com/tjthouhid/iw-developer-skills-assessment.git
   composer install
   npm ci
   ```
   
2. **Copy the .env file**:
   
   The `.env.example` file is pre-populated with non-sensitive values, simply copy it to a new `.env` file:
   
   ```bash
   cp .env.example .env
   ```
   
3. **Generate a new APP_KEY**:
   
   ```bash
   php artisan key:generate
   ```
   
4. **Development environment**:
   
   You can use any development environment you're comfortable with. However, a **local PostgreSQL** database is required. The project is pre-configured with a **Laravel Sail** environment for easy setup. To use Laravel Sail, start the Docker daemon, then build and run the containers:
   
   ```bash
   composer sail-up
   ```
   
   > **Note**: Depending on your operating system, you may encounter the following Rollup error:
   
   `Error: Cannot find module @rollup/rollup-linux-arm64-gnu`
   
   This issue is due to a known npm bug: [npm/cli/issues#4828](https://github.com/npm/cli/issues/4828). To fix this, exec into the Laravel container and reinstall npm dependencies:
   
   ```bash
   rm -rf node_modules
   rm -f package-lock.json
   npm i
   ```
   
5. **Run database migrations**:
   
   ```bash
   composer sail-migrate-fresh
   ```

6. **Run database seeders**:

```bash
composer sail-seed
```

This will seed your local PostgreSQL database with 1000 fake users.

7. **View your local app**: After seeding the database, navigate to [http://127.0.0.1/](http://127.0.0.1/) to view the application.
