# API Integration Setup

This directory contains all the API configuration and helper functions for integrating with the backend.

## Structure

```
utils/
├── apiConfig.js    # All API route definitions
├── api.js          # Axios instance with interceptors
└── index.js        # Barrel exports

queries/
├── authQueries.js
├── doctorQueries.js
├── patientQueries.js
├── adminQueries.js
├── ... (all query files)
└── index.js

mutations/
├── authMutations.js
├── doctorMutations.js
├── patientMutations.js
├── adminMutations.js
├── ... (all mutation files)
└── index.js
```

## Usage

### Using Queries (GET requests)

```javascript
import { useDoctors, useDoctorProfile } from '../queries'

function DoctorList() {
  const { data, isLoading, error } = useDoctors({ status: 'APPROVED' })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.map(doctor => (
        <div key={doctor.id}>{doctor.name}</div>
      ))}
    </div>
  )
}
```

### Using Mutations (POST/PUT/DELETE requests)

```javascript
import { useLogin, useRegister } from '../mutations'

function LoginForm() {
  const loginMutation = useLogin()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await loginMutation.mutateAsync({
        email: 'user@example.com',
        password: 'password123'
      })
      console.log('Login successful:', result)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Using API Directly

```javascript
import { api } from '../utils'

// GET request
const doctors = await api.get('/doctor', { params: { status: 'APPROVED' } })

// POST request
const newDoctor = await api.post('/auth/register', {
  fullName: 'Dr. John Doe',
  email: 'doctor@example.com',
  password: 'password123',
  role: 'DOCTOR'
})

// Upload file
const formData = new FormData()
formData.append('file', file)
const result = await api.upload('/upload/profile', formData)
```

## Configuration

The base URL is configured in `apiConfig.js`. To change it:

```javascript
// src/utils/apiConfig.js
const BASE_URL = 'http://localhost:5000/api' // Change this
```

## Authentication

The API client automatically adds the JWT token from localStorage to all requests. Tokens are stored after successful login:

- `token` - Access token
- `refreshToken` - Refresh token

If a 401 error occurs, the tokens are automatically cleared and the user is redirected to login.

## Available Queries & Mutations

See individual files in `queries/` and `mutations/` folders for all available hooks.

