import React, { useState } from "react";
import SectionContainer from "../../components/SectionContainer";
import { FaBell, FaShieldAlt, FaCreditCard, FaGlobe, FaLock, FaSignOutAlt, FaEnvelope, FaPhone, FaEye, FaHistory, FaChartLine, FaUser } from 'react-icons/fa';
import { IoMdNotifications, IoMdFingerPrint } from 'react-icons/io';
import { BsCreditCard2Front } from 'react-icons/bs';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('notifications');
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        transactionAlerts: true,
        accountActivity: true,
        marketingEmails: false,
        
        twoFactorAuth: false,
        biometricLogin: true,
        autoLogout: true,
        autoLogoutTime: 5, 
        
        currency: 'USD',
        language: 'en',
        timezone: 'America/New_York',
        
        showBalance: true,
        showRecentTransactions: true,
        dataSharing: false,
    });

    const handleSettingChange = (setting, value) => {
        setSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const handleLogout = () => {
        console.log('User logged out');
    };

    const SettingToggle = ({ label, description, checked, onChange, icon: Icon }) => (
        <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100">
            <div className="flex items-center">
                {Icon && <Icon className="text-blue-500 mr-3 text-lg" />}
                <div>
                    <p className="font-medium text-gray-800">{label}</p>
                    {description && <p className="text-sm text-gray-500">{description}</p>}
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={checked} 
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );

    const SettingSelect = ({ label, value, options, onChange, icon: Icon }) => (
        <div className="flex items-center justify-between py-3 px-4 border-b border-gray-100">
            <div className="flex items-center">
                {Icon && <Icon className="text-blue-500 mr-3 text-lg" />}
                <span className="font-medium text-gray-800">{label}</span>
            </div>
            <select 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-700 py-1 px-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );

    const renderTabContent = () => {
        switch(activeTab) {
            case 'notifications':
                return (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
                        <SettingToggle 
                            label="Email Notifications"
                            description="Receive account notifications via email"
                            checked={settings.emailNotifications}
                            onChange={(val) => handleSettingChange('emailNotifications', val)}
                            icon={FaEnvelope}
                        />
                        <SettingToggle 
                            label="SMS Notifications"
                            description="Receive important alerts via text message"
                            checked={settings.smsNotifications}
                            onChange={(val) => handleSettingChange('smsNotifications', val)}
                            icon={FaPhone}
                        />
                        <SettingToggle 
                            label="Push Notifications"
                            description="Get instant alerts on your device"
                            checked={settings.pushNotifications}
                            onChange={(val) => handleSettingChange('pushNotifications', val)}
                            icon={IoMdNotifications}
                        />
                        <SettingToggle 
                            label="Transaction Alerts"
                            description="Get notified for all transactions"
                            checked={settings.transactionAlerts}
                            onChange={(val) => handleSettingChange('transactionAlerts', val)}
                            icon={BsCreditCard2Front}
                        />
                        <SettingToggle 
                            label="Account Activity"
                            description="Alerts for logins and security events"
                            checked={settings.accountActivity}
                            onChange={(val) => handleSettingChange('accountActivity', val)}
                            icon={FaShieldAlt}
                        />
                        <SettingToggle 
                            label="Marketing Communications"
                            description="Receive offers and news from our bank"
                            checked={settings.marketingEmails}
                            onChange={(val) => handleSettingChange('marketingEmails', val)}
                            icon={FaEnvelope}
                        />
                    </div>
                );
            
            case 'security':
                return (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
                        <SettingToggle 
                            label="Two-Factor Authentication"
                            description="Add an extra layer of security to your account"
                            checked={settings.twoFactorAuth}
                            onChange={(val) => handleSettingChange('twoFactorAuth', val)}
                            icon={FaLock}
                        />
                        <SettingToggle 
                            label="Biometric Login"
                            description="Use fingerprint or face recognition to log in"
                            checked={settings.biometricLogin}
                            onChange={(val) => handleSettingChange('biometricLogin', val)}
                            icon={IoMdFingerPrint}
                        />
                        <SettingToggle 
                            label="Auto Logout"
                            description="Automatically log out after period of inactivity"
                            checked={settings.autoLogout}
                            onChange={(val) => handleSettingChange('autoLogout', val)}
                            icon={FaSignOutAlt}
                        />
                        {settings.autoLogout && (
                            <div className="px-4 py-3 bg-gray-50 rounded-md">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Auto Logout After</span>
                                    <select 
                                        value={settings.autoLogoutTime}
                                        onChange={(e) => handleSettingChange('autoLogoutTime', parseInt(e.target.value))}
                                        className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={1}>1 minute</option>
                                        <option value={5}>5 minutes</option>
                                        <option value={15}>15 minutes</option>
                                        <option value={30}>30 minutes</option>
                                        <option value={60}>1 hour</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        <div className="mt-6">
                            <h4 className="text-md font-semibold text-gray-800 mb-3">Active Sessions</h4>
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">This Device</p>
                                            <p className="text-sm text-gray-500">Windows 10 • Chrome • {new Date().toLocaleString()}</p>
                                            <p className="text-xs text-green-600 mt-1">Current Session</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">iPhone 13 Pro</p>
                                            <p className="text-sm text-gray-500">iOS 15 • Safari • 2 hours ago</p>
                                        </div>
                                        <button className="text-sm text-red-600 hover:text-red-800">
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'account':
                return (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Preferences</h3>
                        <SettingSelect 
                            label="Default Currency"
                            value={settings.currency}
                            onChange={(val) => handleSettingChange('currency', val)}
                            options={[
                                { value: 'USD', label: 'US Dollar (USD)' },
                                { value: 'EUR', label: 'Euro (EUR)' },
                                { value: 'GBP', label: 'British Pound (GBP)' },
                                { value: 'JPY', label: 'Japanese Yen (JPY)' },
                            ]}
                            icon={FaCreditCard}
                        />
                        <SettingSelect 
                            label="Language"
                            value={settings.language}
                            onChange={(val) => handleSettingChange('language', val)}
                            options={[
                                { value: 'en', label: 'English' },
                                { value: 'es', label: 'Español' },
                                { value: 'fr', label: 'Français' },
                                { value: 'de', label: 'Deutsch' },
                            ]}
                            icon={FaGlobe}
                        />
                        <SettingSelect 
                            label="Timezone"
                            value={settings.timezone}
                            onChange={(val) => handleSettingChange('timezone', val)}
                            options={[
                                { value: 'America/New_York', label: 'Eastern Time (ET)' },
                                { value: 'America/Chicago', label: 'Central Time (CT)' },
                                { value: 'America/Denver', label: 'Mountain Time (MT)' },
                                { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                            ]}
                            icon={FaGlobe}
                        />
                        <div className="mt-6">
                            <h4 className="text-md font-semibold text-gray-800 mb-3">Danger Zone</h4>
                            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-red-800">Close Account</p>
                                        <p className="text-sm text-red-600">Permanently delete your account and all associated data</p>
                                    </div>
                                    <button className="px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-md hover:bg-red-50">
                                        Close Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'privacy':
                return (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy Settings</h3>
                        <SettingToggle 
                            label="Show Account Balance"
                            description="Display your account balance on the dashboard"
                            checked={settings.showBalance}
                            onChange={(val) => handleSettingChange('showBalance', val)}
                            icon={FaEye}
                        />
                        <SettingToggle 
                            label="Show Recent Transactions"
                            description="Display recent transactions on the dashboard"
                            checked={settings.showRecentTransactions}
                            onChange={(val) => handleSettingChange('showRecentTransactions', val)}
                            icon={FaHistory}
                        />
                        <SettingToggle 
                            label="Data Sharing"
                            description="Allow us to use your anonymized data to improve our services"
                            checked={settings.dataSharing}
                            onChange={(val) => handleSettingChange('dataSharing', val)}
                            icon={FaChartLine}
                        />
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">Download Your Data</h4>
                            <p className="text-sm text-blue-700 mb-3">Request a copy of all your personal data we have stored.</p>
                            <button className="px-4 py-2 bg-white border border-blue-300 text-blue-700 text-sm font-medium rounded-md hover:bg-blue-50">
                                Request Data Download
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const SettingTab = ({ icon: Icon, label, tabName }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
                activeTab === tabName 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'
            }`}
        >
            <Icon className={`mr-3 text-lg ${
                activeTab === tabName ? 'text-blue-500' : 'text-gray-400'
            }`} />
            {label}
        </button>
    );

    return (
        <SectionContainer>
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                        {/* Sidebar Navigation */}
                        <div className="md:w-64 border-r border-gray-200 bg-gray-50">
                            <div className="p-4">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>
                                <nav className="space-y-1">
                                    <SettingTab 
                                        icon={IoMdNotifications} 
                                        label="Notifications" 
                                        tabName="notifications" 
                                    />
                                    <SettingTab 
                                        icon={FaLock} 
                                        label="Security" 
                                        tabName="security" 
                                    />
                                    <SettingTab 
                                        icon={FaUser} 
                                        label="Account" 
                                        tabName="account" 
                                    />
                                    <SettingTab 
                                        icon={FaShieldAlt} 
                                        label="Privacy" 
                                        tabName="privacy" 
                                    />
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-6">
                            {renderTabContent()}
                            
                            {/* Logout Button */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center text-red-600 hover:text-red-800"
                                >
                                    <FaSignOutAlt className="mr-2" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionContainer>
    );
};

export default Settings;