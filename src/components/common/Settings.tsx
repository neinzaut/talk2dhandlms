import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { storage } from '../../utils/storage';
import { Settings as SettingsIcon, Key, Languages, HelpCircle, Check } from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccess, setShowSuccess] = useState(false);
  const user = storage.getUser();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    signLanguage: user?.preferences.signLanguage || 'ASL',
    learningGoal: user?.preferences.learningGoal || 'regular',
  });

  const handleProfileUpdate = () => {
    if (!user) {
      navigate('/');
      return;
    }
    const updatedUser: User = {
      ...user,
      name: formData.name,
      email: formData.email,
    };
    storage.setUser(updatedUser);
    storage.addRegisteredUser(updatedUser);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/dashboard');
    }, 2000);
  };

  const handlePasswordChange = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // Here you would typically make an API call to update the password
    alert('Password updated successfully!');
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
    navigate('/dashboard');
  };

  const handleGoalChange = (goal: 'casual' | 'regular' | 'intensive') => {
    if (!user) {
      navigate('/');
      return;
    }
    const dailyGoal = goal === 'casual' ? 10 : goal === 'regular' ? 15 : 20;
    const updatedUser: User = {
      ...user,
      preferences: {
        ...user.preferences,
        learningGoal: goal,
        dailyGoal,
      },
    };
    storage.setUser(updatedUser);
    storage.addRegisteredUser(updatedUser);
    setFormData({ ...formData, learningGoal: goal });
    alert('Learning goal updated successfully!');
    navigate('/dashboard');
  };

  const handleLanguageChange = (language: 'ASL' | 'BSL') => {
    if (!user) {
      navigate('/');
      return;
    }
    const updatedUser: User = {
      ...user,
      preferences: {
        ...user.preferences,
        signLanguage: language,
      },
    };
    storage.setUser(updatedUser);
    storage.addRegisteredUser(updatedUser);
    setFormData({ ...formData, signLanguage: language });
    alert('Sign language preference updated successfully!');
    navigate('/dashboard');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleProfileUpdate}
              className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Update Password
            </button>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sign Language Preference</h3>
              <div className="space-y-4">
                {['ASL', 'BSL'].map((lang) => (
                  <button
                    key={lang}
                    className={`w-full p-4 rounded-lg border-2 ${formData.signLanguage === lang ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                    onClick={() => handleLanguageChange(lang as 'ASL' | 'BSL')}
                  >
                    {lang === 'ASL' ? 'American Sign Language' : 'British Sign Language'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Goals</h3>
              <div className="space-y-4">
                {[
                  { value: 'casual', label: 'Casual (10 minutes/day)' },
                  { value: 'regular', label: 'Regular (15 minutes/day)' },
                  { value: 'intensive', label: 'Intensive (20 minutes/day)' },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    className={`w-full p-4 rounded-lg border-2 ${user?.preferences.learningGoal === goal.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                    onClick={() => handleGoalChange(goal.value as 'casual' | 'regular' | 'intensive')}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">How do I track my progress?</h4>
                  <p className="mt-1 text-sm text-gray-500">Your progress is automatically tracked in the dashboard, showing your daily streak, completed lessons, and achievements.</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Can I switch between ASL and BSL?</h4>
                  <p className="mt-1 text-sm text-gray-500">Yes, you can switch between American Sign Language (ASL) and British Sign Language (BSL) in the language settings.</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Need Help?</h3>
              <p className="mt-1 text-sm text-gray-500">Contact our support team at support@signlanguageapp.com</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-down">
          <div className="bg-green-500 rounded-full p-1">
            <Check className="h-4 w-4 text-white" />
          </div>
          <p className="font-medium">Changes saved successfully!</p>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Dashboard
          </button>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'profile', name: 'Profile', icon: SettingsIcon },
                { id: 'security', name: 'Security', icon: Key },
                { id: 'preferences', name: 'Preferences', icon: Languages },
                { id: 'help', name: 'Help', icon: HelpCircle },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}