// Settings management
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        this.loadSettingsToUI();
        this.bindEvents();
    }

    loadSettings() {
        const defaultSettings = {
            theme: 'dark',
            animations: true,
            compact: false,
            refreshRate: '60',
            defaultView: 'dashboard',
            currency: 'USD',
            emailAlerts: false,
            salesAlerts: true,
            threshold: 1000,
            dataRetention: '90',
            autoBackup: true,
            username: 'admin',
            email: 'admin@pharmaanalytics.com'
        };

        const saved = localStorage.getItem('pharmaAnalyticsSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('pharmaAnalyticsSettings', JSON.stringify(this.settings));
        this.showNotification('Settings saved successfully!', 'success');
    }

    loadSettingsToUI() {
        Object.keys(this.settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings[key];
                } else {
                    element.value = this.settings[key];
                }
            }
        });
    }

    bindEvents() {
        // Save settings
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.collectSettingsFromUI();
            this.saveSettings();
            this.applySettings();
        });

        // Reset settings
        document.getElementById('resetSettings').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all settings to defaults?')) {
                localStorage.removeItem('pharmaAnalyticsSettings');
                this.settings = this.loadSettings();
                this.loadSettingsToUI();
                this.applySettings();
                this.showNotification('Settings reset to defaults!', 'info');
            }
        });

        // Export data
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        // Import data
        document.getElementById('importData').addEventListener('click', () => {
            this.importData();
        });

        // Change password
        document.getElementById('changePassword').addEventListener('click', () => {
            this.showChangePasswordDialog();
        });

        // Theme change
        document.getElementById('theme').addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            this.applyTheme();
        });

        // Real-time updates for checkboxes
        const checkboxes = ['animations', 'compact', 'emailAlerts', 'salesAlerts', 'autoBackup'];
        checkboxes.forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                this.settings[id] = e.target.checked;
            });
        });

        // Real-time updates for selects
        const selects = ['refreshRate', 'defaultView', 'currency', 'dataRetention'];
        selects.forEach(id => {
            document.getElementById(id).addEventListener('change', (e) => {
                this.settings[id] = e.target.value;
            });
        });

        // Real-time updates for inputs
        document.getElementById('threshold').addEventListener('input', (e) => {
            this.settings.threshold = parseInt(e.target.value) || 1000;
        });

        document.getElementById('email').addEventListener('input', (e) => {
            this.settings.email = e.target.value;
        });
    }

    collectSettingsFromUI() {
        const checkboxes = ['animations', 'compact', 'emailAlerts', 'salesAlerts', 'autoBackup'];
        checkboxes.forEach(id => {
            this.settings[id] = document.getElementById(id).checked;
        });

        const selects = ['theme', 'refreshRate', 'defaultView', 'currency', 'dataRetention'];
        selects.forEach(id => {
            this.settings[id] = document.getElementById(id).value;
        });

        this.settings.threshold = parseInt(document.getElementById('threshold').value) || 1000;
        this.settings.email = document.getElementById('email').value;
    }

    applySettings() {
        this.applyTheme();
        this.applyAnimations();
        this.applyCompactMode();
    }

    applyTheme() {
        const body = document.body;
        body.classList.remove('light-theme', 'dark-theme');

        if (this.settings.theme === 'light') {
            body.classList.add('light-theme');
        } else if (this.settings.theme === 'dark') {
            body.classList.add('dark-theme');
        }
        // Auto theme would need additional logic for system preference detection
    }

    applyAnimations() {
        document.body.classList.toggle('no-animations', !this.settings.animations);
    }

    applyCompactMode() {
        document.body.classList.toggle('compact-mode', this.settings.compact);
    }

    exportData() {
        const data = {
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pharma-analytics-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Settings exported successfully!', 'success');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.settings) {
                            this.settings = { ...this.settings, ...data.settings };
                            this.saveSettings();
                            this.loadSettingsToUI();
                            this.applySettings();
                            this.showNotification('Settings imported successfully!', 'success');
                        } else {
                            throw new Error('Invalid file format');
                        }
                    } catch (error) {
                        this.showNotification('Error importing settings: ' + error.message, 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    showChangePasswordDialog() {
        const newPassword = prompt('Enter new password:');
        if (newPassword) {
            const confirmPassword = prompt('Confirm new password:');
            if (newPassword === confirmPassword) {
                // In a real app, this would make an API call
                this.showNotification('Password changed successfully!', 'success');
            } else {
                this.showNotification('Passwords do not match!', 'error');
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Hide and remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new SettingsManager();
});