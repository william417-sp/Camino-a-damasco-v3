# 🚀 Deployment Guide - Iglesia Camino a Damasco

## 📋 Pre-Deployment Checklist

### ✅ **Files to Deploy**
- [ ] `index.html` - Main website file
- [ ] `style_iglesia.css` - Responsive stylesheet
- [ ] `Function.js` - JavaScript functionality
- [ ] `manifest.json` - PWA manifest
- [ ] `sw.js` - Service worker
- [ ] `404.html` - Custom error page
- [ ] `robots.txt` - SEO configuration
- [ ] `sitemap.xml` - Search engine sitemap
- [ ] `.htaccess` - Server configuration
- [ ] `Images/` folder - All website images

### 🔧 **Server Requirements**
- **Web Server**: Apache 2.4+ or Nginx 1.18+
- **PHP**: 7.4+ (if using PHP features)
- **SSL Certificate**: HTTPS required for PWA features
- **Mod Rewrite**: Enabled for clean URLs
- **Gzip Compression**: Enabled for performance

## 🌐 **Domain Configuration**

### **DNS Settings**
```
A Record: @ → [Your Server IP]
A Record: www → [Your Server IP]
CNAME: www → yourdomain.com (alternative)
```

### **SSL Certificate**
- **Let's Encrypt**: Free SSL certificate
- **Cloudflare**: Free SSL + CDN
- **Commercial**: DigiCert, Comodo, etc.

## 📁 **File Upload Instructions**

### **Method 1: FTP/SFTP**
1. Connect to your server via FTP client
2. Upload all files to the `public_html` or `www` directory
3. Ensure file permissions are set correctly:
   ```bash
   chmod 644 *.html *.css *.js *.json *.txt *.xml
   chmod 755 Images/
   chmod 644 .htaccess
   ```

### **Method 2: cPanel File Manager**
1. Login to cPanel
2. Open File Manager
3. Navigate to `public_html`
4. Upload all files
5. Extract if uploaded as ZIP

### **Method 3: Git Deployment**
```bash
git clone [your-repository]
cd iglesia-camino-damasco
# Upload files to server
```

## ⚙️ **Server Configuration**

### **Apache (.htaccess)**
The `.htaccess` file is already configured with:
- Security headers
- Compression
- Caching rules
- Error page redirects
- HTTPS redirects (uncomment if needed)

### **Nginx Configuration**
If using Nginx, add this to your server block:
```nginx
server {
    listen 80;
    server_name caminoadamasco.com www.caminoadamasco.com;
    root /var/www/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Caching
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker
    location /sw.js {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Error pages
    error_page 404 /404.html;

    # HTTPS redirect
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name caminoadamasco.com www.caminoadamasco.com;
    root /var/www/html;
    index index.html;

    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Include all the configurations from above
}
```

## 🔍 **SEO Configuration**

### **Google Analytics Setup**
1. Create Google Analytics account
2. Get your Measurement ID (GA_MEASUREMENT_ID)
3. Replace `GA_MEASUREMENT_ID` in `index.html` with your actual ID
4. Verify tracking is working

### **Google Search Console**
1. Add your website to Google Search Console
2. Verify ownership
3. Submit sitemap: `https://caminoadamasco.com/sitemap.xml`
4. Monitor indexing status

### **Bing Webmaster Tools**
1. Add your website to Bing Webmaster Tools
2. Submit sitemap
3. Monitor performance

## 📱 **PWA Configuration**

### **Service Worker**
- Already configured in `sw.js`
- Automatically registers on page load
- Provides offline functionality
- Caches static resources

### **Manifest**
- Already configured in `manifest.json`
- Enables "Add to Home Screen"
- Sets app colors and icons
- Defines display mode

### **Icons Required**
Create these icon sizes for the manifest:
- `icon-192x192.png` - 192x192 pixels
- `icon-512x512.png` - 512x512 pixels
- `apple-touch-icon.png` - 180x180 pixels
- `favicon-32x32.png` - 32x32 pixels
- `favicon-16x16.png` - 16x16 pixels

## 🚀 **Performance Optimization**

### **CDN Setup (Recommended)**
- **Cloudflare**: Free CDN with SSL
- **AWS CloudFront**: Advanced CDN
- **Google Cloud CDN**: High performance

### **Image Optimization**
- Compress all images before upload
- Use WebP format when possible
- Implement responsive images
- Add proper alt text

### **Caching Strategy**
- Browser caching: 1 year for static assets
- Service worker caching: Automatic
- CDN caching: Configure based on content type

## 🔒 **Security Configuration**

### **SSL/TLS**
- Enable HTTPS redirect
- Use strong cipher suites
- Implement HSTS headers
- Regular certificate renewal

### **Security Headers**
Already configured in `.htaccess`:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer Policy
- Permissions Policy

### **File Permissions**
```bash
# Set correct permissions
find /var/www/html -type f -exec chmod 644 {} \;
find /var/www/html -type d -exec chmod 755 {} \;
chmod 600 .htaccess
```

## 📊 **Monitoring & Analytics**

### **Performance Monitoring**
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Chrome DevTools Lighthouse

### **Uptime Monitoring**
- UptimeRobot (free)
- Pingdom
- StatusCake

### **Error Tracking**
- Google Analytics Error Tracking
- Sentry (advanced)
- Log files monitoring

## 🧪 **Testing Checklist**

### **Functionality Testing**
- [ ] All links work correctly
- [ ] Forms submit properly
- [ ] Images load correctly
- [ ] Responsive design works on all devices
- [ ] Service worker registers
- [ ] PWA features work
- [ ] 404 page displays correctly

### **Performance Testing**
- [ ] Page load speed < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Mobile-friendly test passes
- [ ] SSL test passes

### **SEO Testing**
- [ ] Meta tags present
- [ ] Sitemap accessible
- [ ] Robots.txt working
- [ ] Structured data valid
- [ ] Social media previews work

## 🔄 **Maintenance Schedule**

### **Weekly**
- [ ] Check website uptime
- [ ] Monitor Google Analytics
- [ ] Review error logs
- [ ] Test critical functionality

### **Monthly**
- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Check for broken links
- [ ] Update content as needed

### **Quarterly**
- [ ] Security audit
- [ ] Performance optimization review
- [ ] SEO analysis
- [ ] Backup verification

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Service Worker Not Working**
- Check HTTPS is enabled
- Verify `sw.js` is accessible
- Check browser console for errors
- Clear browser cache

#### **Images Not Loading**
- Check file paths
- Verify file permissions
- Check image file sizes
- Test with different browsers

#### **CSS Not Loading**
- Check file path in HTML
- Verify `.htaccess` compression
- Check browser cache
- Validate CSS syntax

#### **Forms Not Working**
- Check form action URLs
- Verify server-side processing
- Check JavaScript errors
- Test form validation

### **Support Resources**
- **Browser DevTools**: F12 for debugging
- **Google Search Console**: SEO issues
- **Google Analytics**: Performance data
- **Server Logs**: Error investigation

## 📞 **Post-Deployment**

### **Immediate Actions**
1. Test all functionality
2. Submit sitemap to search engines
3. Set up monitoring
4. Configure backups
5. Document any custom configurations

### **First Week**
1. Monitor performance metrics
2. Check for any errors
3. Verify analytics tracking
4. Test on various devices
5. Gather user feedback

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Server**: ___________  
**Domain**: ___________  

**Notes**: 
_________________________________
_________________________________
_________________________________
