import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Switch,
  Divider,
  useTheme,
  FormControlLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import NeoPOPButton from '../components/common/NeoPOPButton';
import NeoPOPTextField from '../components/common/NeoPOPTextField';

const Settings = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    soundEnabled: true,
    language: 'English',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange =
    (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setSettings({ ...settings, [setting]: event.target.checked });
    };

  const SettingSection = ({ icon, title, children }: any) => (
    <Box sx={{ mb: 4.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
        {icon}
        <Typography
          variant='h6'
          sx={{
            fontFamily: 'Raleway',
            fontWeight: 600,
            color: '#2C3E50',
            fontSize: { xs: '1.1rem', md: '1.25rem' },
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ pl: 2 }}>
        {children}
      </Box>
      <Divider sx={{ mt: 3 }} />
    </Box>
  );

  return (
    <Container
      maxWidth='md'
      sx={{
        py: { xs: 3, md: 5 },
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff 0%, #FFF5E9 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow:
              '4px 4px 0 rgba(0, 0, 0, 0.1), 8px 8px 32px rgba(255, 132, 19, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            p: { xs: 2.5, sm: 3, md: 4 },
          }}
        >
          <Typography
            variant='h4'
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 700,
              color: '#2C3E50',
              mb: 5,
              fontSize: { xs: '1.75rem', md: '2rem' },
            }}
          >
            Settings
          </Typography>

          <SettingSection
            icon={
              <DarkModeIcon
                sx={{ color: theme.palette.primary.main, fontSize: 28 }}
              />
            }
            title='Appearance'
          >
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={handleChange('darkMode')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '0.95rem', color: 'rgba(0, 0, 0, 0.8)' }}>
                  Dark Mode
                </Typography>
              }
              sx={{ ml: 0 }}
            />
          </SettingSection>

          <SettingSection
            icon={
              <NotificationsIcon
                sx={{ color: theme.palette.primary.main, fontSize: 28 }}
              />
            }
            title='Notifications'
          >
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications}
                  onChange={handleChange('notifications')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              }
              label='Enable Notifications'
            />
          </SettingSection>

          <SettingSection
            icon={
              <VolumeUpIcon
                sx={{ color: theme.palette.primary.main, fontSize: 28 }}
              />
            }
            title='Sound'
          >
            <FormControlLabel
              control={
                <Switch
                  checked={settings.soundEnabled}
                  onChange={handleChange('soundEnabled')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              }
              label='Enable Sound'
            />
          </SettingSection>

          <SettingSection
            icon={
              <LanguageIcon
                sx={{ color: theme.palette.primary.main, fontSize: 28 }}
              />
            }
            title='Language'
          >
            <NeoPOPTextField
              select
              fullWidth
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
              SelectProps={{
                native: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.95rem',
                },
              }}
            >
              <option value='English'>English</option>
              <option value='Spanish'>Spanish</option>
              <option value='French'>French</option>
              <option value='German'>German</option>
            </NeoPOPTextField>
          </SettingSection>

          <SettingSection
            icon={
              <SecurityIcon
                sx={{ color: theme.palette.primary.main, fontSize: 28 }}
              />
            }
            title='Security'
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <NeoPOPTextField
                type='password'
                label='Current Password'
                fullWidth
                value={settings.currentPassword}
                onChange={(e) =>
                  setSettings({ ...settings, currentPassword: e.target.value })
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '0.95rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.95rem',
                  },
                }}
              />
              <NeoPOPTextField
                type='password'
                label='New Password'
                fullWidth
                value={settings.newPassword}
                onChange={(e) =>
                  setSettings({ ...settings, newPassword: e.target.value })
                }
              />
              <NeoPOPTextField
                type='password'
                label='Confirm New Password'
                fullWidth
                value={settings.confirmPassword}
                onChange={(e) =>
                  setSettings({ ...settings, confirmPassword: e.target.value })
                }
              />
            </Box>
          </SettingSection>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <NeoPOPButton
              size='large'
              sx={{
                px: { xs: 4, md: 6 },
                py: 1.75,
                fontSize: '1rem',
              }}
            >
              Save Changes
            </NeoPOPButton>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Settings;
