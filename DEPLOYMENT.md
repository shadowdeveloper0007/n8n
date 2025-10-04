# n8n Deployment Guide for Render

This guide will help you deploy your n8n automation platform to Render using their native Node.js environment.

## 📋 Prerequisites

- A Render account (free tier available)
- Git repository with your n8n project
- Basic understanding of environment variables

## 🚀 Quick Start

### Step 1: Prepare Your Project

1. **Generate Encryption Key**:
   ```bash
   # Generate a secure 32-character encryption key
   openssl rand -hex 16
   ```

2. **Create Strong Password**:
   ```bash
   # Generate a secure password for basic auth
   openssl rand -base64 32
   ```

### Step 2: Deploy to Render

#### Option A: Using Render Dashboard (Recommended)

1. **Connect Your Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub/GitLab repository
   - Select your n8n repository

2. **Configure Web Service**:
   ```
   Name: n8n-automation
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Starter (free) or Standard/Pro for production
   ```

3. **PostgreSQL Database** (Already Created):
   - ✅ Database: `n8n_t4jt`
   - ✅ Host: `dpg-d3glauvdiees73d7vadg-a.oregon-postgres.render.com`
   - ✅ Username: `n8n`
   - ✅ Password: `Z5Qro7d3h3USCCQ75iR05H5rVfMC58ZN`

4. **Set Environment Variables**:
   In your web service settings, add these environment variables:

   ```bash
   # Basic Configuration
   NODE_ENV=production
   N8N_HOST=0.0.0.0
   N8N_PROTOCOL=https
   N8N_DISABLE_UI=false
   N8N_METRICS=false
   N8N_LOG_LEVEL=info
   
   # Security (REQUIRED - use your generated values)
   N8N_BASIC_AUTH_USER=admin
   N8N_BASIC_AUTH_PASSWORD=your_generated_password_here
   N8N_ENCRYPTION_KEY=your_generated_encryption_key_here
   
   # Database (using your existing PostgreSQL database)
   DB_TYPE=postgresdb
   DB_POSTGRESDB_HOST=dpg-d3glauvdiees73d7vadg-a.oregon-postgres.render.com
   DB_POSTGRESDB_PORT=5432
   DB_POSTGRESDB_DATABASE=n8n_t4jt
   DB_POSTGRESDB_USER=n8n
   DB_POSTGRESDB_PASSWORD=Z5Qro7d3h3USCCQ75iR05H5rVfMC58ZN
   
   # URLs (replace with your actual Render app URL)
   WEBHOOK_URL=https://your-n8n-app.onrender.com
   N8N_EDITOR_BASE_URL=https://your-n8n-app.onrender.com
   
   # Data persistence
   N8N_USER_FOLDER=/opt/render/project/src/.n8n
   ```

#### Option B: Using render.yaml (Advanced)

1. **Push to Git**:
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Deploy via CLI**:
   ```bash
   # Install Render CLI
   npm install -g @render/cli
   
   # Login to Render
   render login
   
   # Deploy from render.yaml
   render deploy
   ```

### Step 3: Configure Database

1. **Wait for Deployment**: Let both services deploy completely
2. **Test Connection**: Check the web service logs for successful database connection
3. **Initialize Database**: n8n will automatically create necessary tables

### Step 4: Access Your n8n Instance

1. **Get Your URL**: Render will provide a URL like `https://your-n8n-app.onrender.com`
2. **Login**: Use the basic auth credentials you set
3. **Verify Setup**: Check that workflows can be created and executed

## 🔧 Configuration Details

### Environment Variables Explained

#### Required Variables:
- `N8N_BASIC_AUTH_USER/PASSWORD`: Authentication for the web interface
- `N8N_ENCRYPTION_KEY`: Encrypts sensitive data (credentials, etc.)
- `DB_*`: PostgreSQL connection details
- `WEBHOOK_URL`: Your Render app URL for webhooks

#### Optional Variables:
- `N8N_LOG_LEVEL`: Logging verbosity (debug, info, warn, error)
- `N8N_METRICS`: Enable/disable telemetry
- `EXECUTIONS_MODE`: How workflows execute (regular, queue)

### Database Options

#### PostgreSQL (Recommended):
- Persistent data storage
- Better performance
- Supports concurrent users
- Free tier available

#### SQLite (Not Recommended):
- File-based storage
- Limited to single user
- Data lost on restart (unless using Render Disk)

## 📦 Data Migration

### Export from Local n8n:

1. **Export Workflows**:
   ```bash
   # Using n8n CLI
   npx n8n export:workflow --all --output=workflows.json
   
   # Or manually export from UI:
   # Settings → Data → Export workflows
   ```

2. **Export Credentials**:
   ```bash
   # Using n8n CLI
   npx n8n export:credentials --all --output=credentials.json
   
   # Or manually export from UI:
   # Settings → Data → Export credentials
   ```

### Import to Render n8n:

1. **Access Your Deployed n8n**:
   - Go to `https://your-n8n-app.onrender.com`
   - Login with your basic auth credentials

2. **Import Data**:
   - Go to Settings → Data → Import
   - Upload your exported files
   - Verify workflows and credentials

## 🔒 Security Best Practices

### 1. Authentication:
- Use strong passwords for `N8N_BASIC_AUTH_PASSWORD`
- Consider upgrading to OAuth providers later

### 2. Encryption:
- Never reuse encryption keys
- Store keys securely (Render environment variables)

### 3. Database Security:
- Use strong database passwords
- Consider restricting database access by IP

### 4. HTTPS:
- Always use `N8N_PROTOCOL=https` in production
- Render provides free SSL certificates

## 🚨 Troubleshooting

### Common Issues:

#### 1. Database Connection Failed:
```bash
# Check database environment variables
# Verify PostgreSQL service is running
# Check network connectivity
```

#### 2. Workflows Not Executing:
```bash
# Verify WEBHOOK_URL is correct
# Check N8N_EDITOR_BASE_URL
# Ensure HTTPS protocol is set
```

#### 3. Data Not Persisting:
```bash
# Verify database configuration
# Check N8N_USER_FOLDER path
# Ensure PostgreSQL is properly connected
```

#### 4. App Won't Start:
```bash
# Check build logs in Render dashboard
# Verify all required environment variables are set
# Check Node.js version compatibility
```

### Debug Commands:

```bash
# Check environment variables
render env:list

# View application logs
render logs

# Restart services
render restart
```

## 📈 Scaling

### Upgrade Plans:
- **Starter**: Free, 750 hours/month, sleep after 15min inactivity
- **Standard**: $7/month, always-on, 0.5GB RAM
- **Pro**: $25/month, always-on, 2GB RAM, custom domains

### Performance Optimization:
1. **Database**: Upgrade to Standard/Pro PostgreSQL
2. **Memory**: Increase RAM allocation
3. **Queue**: Add Redis for better workflow execution
4. **CDN**: Use Render's global CDN

## 🔄 Updates and Maintenance

### Updating n8n:
1. Update `package.json` with new n8n version
2. Commit and push changes
3. Render will automatically redeploy

### Backup Strategy:
1. **Database**: Render automatically backs up PostgreSQL
2. **Workflows**: Export regularly via n8n UI
3. **Credentials**: Export and store securely

## 📞 Support

- **Render Documentation**: https://render.com/docs
- **n8n Documentation**: https://docs.n8n.io
- **Community**: https://community.n8n.io

## ✅ Deployment Checklist

- [ ] Generated secure encryption key
- [ ] Created strong basic auth password
- [ ] Set up PostgreSQL database
- [ ] Configured all environment variables
- [ ] Deployed web service
- [ ] Verified database connection
- [ ] Tested n8n interface access
- [ ] Imported local workflows/credentials
- [ ] Tested workflow execution
- [ ] Verified webhook URLs work
- [ ] Set up monitoring/alerting (optional)

Your n8n instance should now be running on Render! 🎉
