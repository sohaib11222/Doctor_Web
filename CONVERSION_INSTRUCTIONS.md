# Page Conversion Instructions

## How to Convert Each Page

### Step 1: Read the Original Blade Template
```bash
# Example: Convert index-2.blade.php
# Location: resources/views/index-2.blade.php
```

### Step 2: Create React Component
```javascript
// src/pages/Index2.jsx
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

const Index2 = () => {
  useEffect(() => {
    // Initialize plugins if needed
    if (typeof window !== 'undefined' && window.$) {
      $('.owl-carousel').owlCarousel({ /* options */ })
    }
  }, [])

  return (
    <MainLayout>
      {/* Convert Blade HTML to JSX */}
      {/* Replace {{ }} with { } */}
      {/* Replace @if with {condition && ...} */}
      {/* Replace @foreach with .map() */}
      {/* Replace {{url('path')}} with <Link to="/path"> */}
      {/* Replace {{URL::asset('assets/...')}} with /assets/... */}
    </MainLayout>
  )
}

export default Index2
```

### Step 3: Conversion Patterns

#### Blade → JSX Conversions:

1. **Variables:**
   ```blade
   {{ $variable }}
   ```
   ```jsx
   {variable}
   ```

2. **Conditionals:**
   ```blade
   @if($condition)
     <div>Content</div>
   @endif
   ```
   ```jsx
   {condition && <div>Content</div>}
   ```

3. **Loops:**
   ```blade
   @foreach($items as $item)
     <div>{{ $item->name }}</div>
   @endforeach
   ```
   ```jsx
   {items.map(item => (
     <div key={item.id}>{item.name}</div>
   ))}
   ```

4. **Links:**
   ```blade
   <a href="{{url('path')}}">Link</a>
   ```
   ```jsx
   <Link to="/path">Link</Link>
   ```

5. **Images:**
   ```blade
   <img src="{{URL::asset('assets/img/logo.svg')}}" />
   ```
   ```jsx
   <img src="/assets/img/logo.svg" />
   ```

6. **Includes:**
   ```blade
   @include('layout.partials.header')
   ```
   ```jsx
   <Header />
   ```

### Step 4: Test the Page
1. Navigate to the route
2. Check console for errors
3. Verify styling matches original
4. Test functionality

## Quick Conversion Checklist

- [ ] Read original Blade file
- [ ] Create React component file
- [ ] Convert Blade syntax to JSX
- [ ] Update image paths
- [ ] Update links to use React Router
- [ ] Initialize plugins in useEffect
- [ ] Test page functionality
- [ ] Verify design matches original

## Batch Conversion Script

For converting multiple pages, use the Index.jsx as a template and:
1. Copy the structure
2. Replace content sections
3. Update data sources (use API calls)
4. Test each page

