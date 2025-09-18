// Performance Monitor for Iglesia Camino a Damasco
// Version 1.0.0

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = [];
        this.init();
    }

    init() {
        this.measurePageLoad();
        this.measureCoreWebVitals();
        this.setupPerformanceObservers();
        this.trackUserInteractions();
        this.monitorResourceLoading();
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    this.metrics.pageLoad = {
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                        totalTime: navigation.loadEventEnd - navigation.fetchStart,
                        firstByte: navigation.responseStart - navigation.fetchStart,
                        domInteractive: navigation.domInteractive - navigation.fetchStart
                    };
                }
                this.logPerformanceMetrics();
            }, 1000);
        });
    }

    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                this.checkLCPThreshold(lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(lcpObserver);

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    this.checkFIDThreshold(entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            this.observers.push(fidObserver);

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.cls = clsValue;
                this.checkCLSThreshold(clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(clsObserver);
        }
    }

    setupPerformanceObservers() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const longTaskObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 50) {
                        console.warn(`Long task detected: ${entry.duration}ms`);
                        this.metrics.longTasks = (this.metrics.longTasks || 0) + 1;
                    }
                });
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
            this.observers.push(longTaskObserver);
        }
    }

    trackUserInteractions() {
        let interactionCount = 0;
        const interactionTypes = ['click', 'scroll', 'keydown', 'touchstart'];

        interactionTypes.forEach(type => {
            document.addEventListener(type, () => {
                interactionCount++;
                this.metrics.userInteractions = interactionCount;
            }, { passive: true });
        });
    }

    monitorResourceLoading() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 1000) {
                        console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
            this.observers.push(resourceObserver);
        }
    }

    checkLCPThreshold(lcp) {
        if (lcp > 4000) {
            console.warn(`Poor LCP: ${lcp}ms (threshold: 4000ms)`);
        } else if (lcp > 2500) {
            console.warn(`Needs improvement LCP: ${lcp}ms (threshold: 2500ms)`);
        } else {
            console.log(`Good LCP: ${lcp}ms`);
        }
    }

    checkFIDThreshold(fid) {
        if (fid > 300) {
            console.warn(`Poor FID: ${fid}ms (threshold: 300ms)`);
        } else if (fid > 100) {
            console.warn(`Needs improvement FID: ${fid}ms (threshold: 100ms)`);
        } else {
            console.log(`Good FID: ${fid}ms`);
        }
    }

    checkCLSThreshold(cls) {
        if (cls > 0.25) {
            console.warn(`Poor CLS: ${cls} (threshold: 0.25)`);
        } else if (cls > 0.1) {
            console.warn(`Needs improvement CLS: ${cls} (threshold: 0.1)`);
        } else {
            console.log(`Good CLS: ${cls}`);
        }
    }

    logPerformanceMetrics() {
        console.group('🚀 Performance Metrics');
        console.log('Page Load:', this.metrics.pageLoad);
        console.log('Core Web Vitals:', {
            LCP: this.metrics.lcp ? `${this.metrics.lcp.toFixed(2)}ms` : 'Not measured',
            FID: this.metrics.fid ? `${this.metrics.fid.toFixed(2)}ms` : 'Not measured',
            CLS: this.metrics.cls ? this.metrics.cls.toFixed(4) : 'Not measured'
        });
        console.log('User Interactions:', this.metrics.userInteractions || 0);
        console.log('Long Tasks:', this.metrics.longTasks || 0);
        console.groupEnd();
    }

    getPerformanceReport() {
        return {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            userAgent: navigator.userAgent,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : null
        };
    }

    // Method to send performance data to analytics
    sendToAnalytics() {
        const report = this.getPerformanceReport();
        
        // In a real implementation, you would send this to your analytics service
        // For example: Google Analytics, Mixpanel, or a custom endpoint
        
        if (typeof gtag !== 'undefined') {
            // Google Analytics 4
            gtag('event', 'performance_metrics', {
                lcp: this.metrics.lcp,
                fid: this.metrics.fid,
                cls: this.metrics.cls,
                page_load_time: this.metrics.pageLoad?.totalTime
            });
        }

        // Store in localStorage for debugging
        localStorage.setItem('performance_report', JSON.stringify(report));
        
        console.log('Performance report sent to analytics');
    }

    // Cleanup method
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }

    // Public methods for external use
    getMetrics() {
        return this.metrics;
    }

    measureCustomMetric(name, startTime, endTime) {
        this.metrics[name] = endTime - startTime;
        return this.metrics[name];
    }

    startCustomTimer(name) {
        this.metrics[`${name}_start`] = performance.now();
    }

    endCustomTimer(name) {
        const startTime = this.metrics[`${name}_start`];
        if (startTime) {
            this.metrics[name] = performance.now() - startTime;
            delete this.metrics[`${name}_start`];
            return this.metrics[name];
        }
        return null;
    }
}

// Initialize performance monitor when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.performanceMonitor = new PerformanceMonitor();
    
    // Send performance data after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            window.performanceMonitor.sendToAnalytics();
        }, 2000);
    });
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}
