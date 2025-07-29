import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Paper, 
  Typography, 
  Alert, 
  CircularProgress,
  Chip,
  Container,
  Divider,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { Home, Book } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material/Select';
import Editor from '@monaco-editor/react';
import { useAuth } from '../contexts/AuthContext';
import type { Device } from '../types';

interface SerialMessage {
  timestamp: string;
  data: string;
}

const Arduino: React.FC = () => {
  const { user } = useAuth();
  const [code, setCode] = useState(`// Arduino Code
void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("LED ON");
  delay(1000);
  
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}
`);
  
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [userSlot, setUserSlot] = useState<number | null>(null);
  const [currentSlot, setCurrentSlot] = useState<number>(0);
  const [serialOutput, setSerialOutput] = useState<SerialMessage[]>([]);
  const [isReadingSerial, setIsReadingSerial] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const serialOutputRef = useRef<HTMLDivElement>(null);

  // Get current slot (0-23 for 24-hour system)
  const getCurrentSlot = () => {
    const now = new Date();
    return now.getHours();
  };

  // Fetch devices on component mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://localhost:8000/devices');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched devices:', data.devices);
          setDevices(data.devices || []);
        } else {
          setError('Failed to fetch devices');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setIsLoadingDevices(false);
      }
    };

    fetchDevices();
  }, []);

  // Fetch user's current slot booking
  useEffect(() => {
    const fetchUserSlot = async () => {
      if (!user?.email) return;
      
      try {
        const email = localStorage.getItem('user_email');
        const password = localStorage.getItem('user_password');
        
        if (!email || !password) return;

        const response = await fetch('http://localhost:8000/slots/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.slot !== null) {
            setUserSlot(data.slot);
          }
        }
      } catch (err) {
        console.error('Error fetching user slot:', err);
      }
    };

    fetchUserSlot();
  }, [user]);

  // Update current slot every minute
  useEffect(() => {
    const updateCurrentSlot = () => {
      setCurrentSlot(getCurrentSlot());
    };

    updateCurrentSlot();
    const interval = setInterval(updateCurrentSlot, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll serial output
  useEffect(() => {
    if (serialOutputRef.current) {
      serialOutputRef.current.scrollTop = serialOutputRef.current.scrollHeight;
    }
  }, [serialOutput]);

  const handleDeviceChange = (event: SelectChangeEvent) => {
    const deviceNumber = event.target.value;
    setSelectedDevice(deviceNumber);
    
    // Close existing WebSocket if any
    if (wsRef.current) {
      wsRef.current.close();
      setIsReadingSerial(false);
      setSerialOutput([]);
    }
  };

  const handleCompile = async () => {
    if (!code.trim()) {
      setError('Please enter some code to compile');
      return;
    }

    setIsCompiling(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/devices/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Code compiled successfully!');
      } else {
        setError(data.message || 'Compilation failed');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedDevice) {
      setError('Please select a device');
      return;
    }

    if (!code.trim()) {
      setError('Please enter some code to upload');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const email = localStorage.getItem('user_email');
      const password = localStorage.getItem('user_password');

      const response = await fetch(`http://localhost:8000/devices/upload/${selectedDevice}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Code uploaded successfully!');
        // Start reading serial output after successful upload
        startSerialReading();
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setIsUploading(false);
    }
  };

  const startSerialReading = () => {
    if (!selectedDevice || !user?.email) return;

    const email = localStorage.getItem('user_email');
    const password = localStorage.getItem('user_password');

    if (!email || !password) {
      setError('Authentication required for serial reading');
      return;
    }

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`ws://localhost:8000/devices/read/${selectedDevice}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected for serial reading');
      setIsReadingSerial(true);
      setSerialOutput([]);
      
      // Send authentication
      ws.send(JSON.stringify({
        email,
        password
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'error') {
          setError(data.message);
          return;
        }
        
        if (data.type === 'connection_established') {
          setSuccess(`Connected to ${data.message}`);
          return;
        }
        
        if (data.type === 'serial_output') {
          const timestamp = new Date().toLocaleTimeString();
          if (data.output && data.output.trim()) {
            setSerialOutput(prev => [...prev, {
              timestamp,
              data: data.output.trim()
            }]);
          }
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsReadingSerial(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error');
      setIsReadingSerial(false);
    };
  };

  const stopSerialReading = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsReadingSerial(false);
  };

  const clearSerialOutput = () => {
    setSerialOutput([]);
  };

  // Check if user can upload (has booked current slot)
  const canUpload = userSlot === currentSlot;

  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Header */}
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Arduino Code Editor
          </Typography>
          <IconButton 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ mr: 1 }}
          >
            <Home />
          </IconButton>
          <IconButton 
            color="inherit" 
            component={Link} 
            to="/booking"
          >
            <Book />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Arduino Code Editor
        </Typography>

      {/* Status Information */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Status</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Current Slot: ${currentSlot}:00`} 
                color="primary" 
                variant="outlined" 
              />
              {userSlot !== null ? (
                <Chip 
                  label={`Your Slot: ${userSlot}:00`} 
                  color={canUpload ? "success" : "default"}
                  variant={canUpload ? "filled" : "outlined"}
                />
              ) : (
                <Chip label="No Slot Booked" color="warning" variant="outlined" />
              )}
              {canUpload && (
                <Chip label="Upload Enabled" color="success" />
              )}
            </Box>
          </Paper>
        </Box>
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Device Selection</Typography>
            <FormControl fullWidth disabled={isLoadingDevices}>
              <InputLabel id="device-select-label">Select Device</InputLabel>
              <Select
                labelId="device-select-label"
                value={selectedDevice}
                label="Select Device"
                onChange={handleDeviceChange}
              >
                {devices.map((device) => (
                  <MenuItem key={devices.indexOf(device)} value={devices.indexOf(device).toString()}>
                    Device {device.model} - {device.port}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isLoadingDevices && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <CircularProgress size={20} />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Code Editor */}
        <Box sx={{ flex: 2, minWidth: '500px' }}>
          <Paper sx={{ p: 2, height: '600px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Code Editor</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleCompile}
                  disabled={isCompiling || !code.trim()}
                  startIcon={isCompiling ? <CircularProgress size={20} /> : null}
                >
                  {isCompiling ? 'Compiling...' : 'Compile'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!canUpload || isUploading || !selectedDevice || !code.trim()}
                  startIcon={isUploading ? <CircularProgress size={20} /> : null}
                  color={canUpload ? "primary" : "inherit"}
                >
                  {isUploading ? 'Uploading...' : 'Upload to Device'}
                </Button>
              </Box>
            </Box>
            <Box sx={{ height: 'calc(100% - 60px)', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Editor
                height="100%"
                defaultLanguage="cpp"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* Serial Output */}
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <Paper sx={{ p: 2, height: '600px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Serial Output</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!isReadingSerial ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={startSerialReading}
                    disabled={!selectedDevice || !canUpload}
                  >
                    Start Reading
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={stopSerialReading}
                    color="secondary"
                  >
                    Stop Reading
                  </Button>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearSerialOutput}
                >
                  Clear
                </Button>
              </Box>
            </Box>
            
            {isReadingSerial && (
              <Chip 
                label="Reading..." 
                color="success" 
                size="small" 
                sx={{ mb: 1, alignSelf: 'flex-start' }}
              />
            )}
            
            <Box
              ref={serialOutputRef}
              sx={{
                flex: 1,
                backgroundColor: '#1a1a1a',
                color: '#00ff00',
                fontFamily: 'monospace',
                fontSize: '12px',
                p: 1,
                borderRadius: 1,
                overflow: 'auto',
                border: 1,
                borderColor: 'divider'
              }}
            >
              {serialOutput.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  {isReadingSerial ? 'Waiting for data...' : 'Serial output will appear here'}
                </Typography>
              ) : (
                serialOutput.map((msg, index) => (
                  <Box key={index} sx={{ mb: 0.5 }}>
                    <Typography component="span" variant="caption" sx={{ color: '#888', mr: 1 }}>
                      [{msg.timestamp}]
                    </Typography>
                    <Typography component="span" variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {msg.data}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Help Text */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Instructions</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          1. <strong>Select a device</strong> from the dropdown above
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          2. <strong>Write your Arduino code</strong> in the editor (C++ syntax supported)
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          3. <strong>Compile</strong> your code to check for errors (optional)
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          4. <strong>Upload</strong> to device (only available if you have booked the current time slot)
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          5. <strong>View serial output</strong> in real-time after uploading
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="warning.main">
          <strong>Note:</strong> You can only upload code during your booked time slot. 
          {!canUpload && userSlot !== null && (
            ` Your slot is ${userSlot}:00, current time is ${currentSlot}:00.`
          )}
          {userSlot === null && (
            ' Please book a slot first in the Slot Booking page.'
          )}
        </Typography>
      </Paper>
      </Container>
    </Box>
  );
};

export default Arduino;
