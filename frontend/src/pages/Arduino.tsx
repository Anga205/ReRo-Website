import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import Editor from '@monaco-editor/react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import type { Device } from '../types';
import LiveStream from '../components/VideoStream';

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
  const [editorWidth, setEditorWidth] = useState<number>(60); // Percentage width
  const [isResizing, setIsResizing] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const serialOutputRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current slot (0-23 for 24-hour system)
  const getCurrentSlot = () => {
    const now = new Date();
    return now.getHours();
  };

  // Fetch devices on component mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('https://rerobackend.anga.codes/devices');
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

        const response = await fetch('https://rerobackend.anga.codes/slots/user', {
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
      const response = await fetch('https://rerobackend.anga.codes/devices/compile', {
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

      const response = await fetch(`https://rerobackend.anga.codes/devices/upload/${selectedDevice}`, {
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

    const ws = new WebSocket(`wss://rerobackend.anga.codes/devices/read/${selectedDevice}`);
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

  // Resize functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    const newWidth = Math.min(Math.max((mouseX / containerWidth) * 100, 20), 80); // Min 20%, Max 80%
    
    setEditorWidth(newWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
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
      <Box 
        ref={containerRef}
        sx={{ 
          display: 'flex', 
          gap: 2, 
          height: '600px',
          position: 'relative'
        }}
      >
        {/* Code Editor */}
        <Box sx={{ 
          width: `${editorWidth}%`, 
          minWidth: '300px',
          transition: isResizing ? 'none' : 'width 0.1s ease'
        }}>
          <Paper sx={{ p: 2, height: '100%' }}>
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

        {/* Resize Handle */}
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            width: '4px',
            cursor: 'col-resize',
            backgroundColor: isResizing ? 'primary.main' : 'divider',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'primary.main',
            },
            zIndex: 10,
          }}
        />

        {/* LiveStream */}
        <Box sx={{ 
          width: `${100 - editorWidth}%`, 
          minWidth: '250px',
          transition: isResizing ? 'none' : 'width 0.1s ease'
        }}>
          {canUpload ? (
            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Live Stream</Typography>
              </Box>
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <LiveStream />
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Live Stream Unavailable
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                You need to book the current time slot to access the live stream.
                {userSlot !== null && (
                  ` Your slot is ${userSlot}:00, current time is ${currentSlot}:00.`
                )}
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Serial Output */}
      <Paper sx={{ p: 2, mt: 3 }}>
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
            height: '300px',
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

      {/* Help Text */}
      </Container>
    </div>
  );
};

export default Arduino;
