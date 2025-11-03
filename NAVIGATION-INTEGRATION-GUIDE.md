# Navigation Component Integration Guide

This guide explains how to manually integrate the reusable navigation component into all your calculator pages for Vercel deployment.

## Files Created

1. **Navigation HTML**: `static/components/navigation.html`
2. **Navigation CSS**: `static/css/nav-component.css`
3. **Navigation JavaScript**: `static/js/nav-component.js`

## Integration Steps

### Step 1: Include CSS File

In each HTML template file, add the navigation CSS **after** your existing CSS link:

```html
<head>
    <!-- Your existing CSS -->
    <link rel="stylesheet" href="{{ url_for('static', filename='css/your_existing_style.css') }}">
    
    <!-- Add navigation component CSS -->
    <link rel="stylesheet" href="{{ url_for('static', filename='css/nav-component.css') }}">
    
    <!-- Your other head elements -->
</head>
```

### Step 2: Include JavaScript File

Add the navigation JavaScript **before** your closing `</body>` tag:

```html
<body>
    <!-- Your existing content -->
    
    <!-- Add navigation component JavaScript -->
    <script src="{{ url_for('static', filename='js/nav-component.js') }}"></script>
    
    <!-- Your existing JavaScript -->
    <script src="{{ url_for('static', filename='js/your_existing_script.js') }}"></script>
</body>
```

### Step 3: Replace Existing Navigation

1. **Locate the existing navigation** in your HTML file (usually inside the `<header>` section)
2. **Copy the nav content** from `static/components/navigation.html`
3. **Replace the existing `<nav>` element** with the new navigation component

**Before** (existing navigation):
```html
<header>
    <h1>Your Calculator Title</h1>
    <nav>
        <!-- Old navigation content -->
    </nav>
</header>
```

**After** (with new navigation component):
```html
<header>
    <h1>Your Calculator Title</h1>
    <!-- COPY THE ENTIRE <nav> SECTION FROM static/components/navigation.html -->
    <nav>
        <a href="/" class="home-btn">Home</a>
        <div class="mega-menu">
            <button class="mega-menu-btn">
                SIP CALCULATORS
                <span class="dropdown-arrow">▼</span>
            </button>
            <div class="mega-menu-content">
                <!-- ... rest of the navigation content ... -->
            </div>
        </div>
    </nav>
</header>
```

### Step 4: Set Active Link (Optional)

To highlight the current page in the navigation:

1. Find the link corresponding to your current page in the navigation
2. Add the `active` class to that link

**Example** for PPF Calculator page:
```html
<a href="/ppf-calculator/" class="mega-link active">PPF Calculator</a>
```

## Complete Integration Example

Here's how a complete HTML file should look after integration:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Calculator Title</title>
    
    <!-- Existing CSS -->
    <link rel="stylesheet" href="{{ url_for('static', filename='css/your_calculator_style.css') }}">
    
    <!-- Navigation component CSS -->
    <link rel="stylesheet" href="{{ url_for('static', filename='css/nav-component.css') }}">
    
    <!-- Fonts and other assets -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <h1>Your Calculator Title</h1>
            
            <!-- NAVIGATION COMPONENT - COPY FROM static/components/navigation.html -->
            <nav>
                <a href="/" class="home-btn">Home</a>
                <div class="mega-menu">
                    <button class="mega-menu-btn">
                        SIP CALCULATORS
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="mega-menu-content">
                        <!-- ... complete navigation content ... -->
                    </div>
                </div>
            </nav>
        </header>

        <!-- Your calculator content -->
        <div class="calculator-container">
            <!-- Your existing calculator content -->
        </div>
    </div>

    <!-- Navigation component JavaScript -->
    <script src="{{ url_for('static', filename='js/nav-component.js') }}"></script>
    
    <!-- Your existing JavaScript -->
    <script src="{{ url_for('static', filename='js/your_calculator_script.js') }}"></script>
</body>
</html>
```

## For Vercel Deployment

When deploying to Vercel:

1. **Ensure all file paths are correct** - Vercel uses the same Flask `url_for` syntax
2. **Upload all component files**:
   - `static/components/navigation.html`
   - `static/css/nav-component.css`
   - `static/js/nav-component.js`
3. **Test navigation on all pages** to ensure dropdown functionality works
4. **Verify responsive design** on mobile devices

## Styling Notes

- The navigation component CSS is designed to **not conflict** with existing page styles
- It uses **specific class names** (`mega-menu`, `mega-link`, etc.) to avoid conflicts
- The component is **responsive** and works on mobile devices
- You can **customize colors and spacing** by modifying `nav-component.css`

## Troubleshooting

### Navigation not working?
- Check that `nav-component.js` is loaded after the DOM
- Ensure jQuery is not interfering (the component uses vanilla JavaScript)

### Styling conflicts?
- Check CSS specificity - navigation styles might be overridden
- Add `!important` to navigation CSS if needed
- Ensure `nav-component.css` is loaded after your main CSS

### Active link not highlighting?
- Verify the `href` attribute matches your current URL path
- Check that the `active` class is properly applied
- The JavaScript will automatically set active links based on current page

## File Locations Summary

```
static/
├── components/
│   └── navigation.html        # Copy this nav content to each page
├── css/
│   └── nav-component.css      # Include in <head>
└── js/
    └── nav-component.js       # Include before </body>
```

This navigation component provides a consistent, professional dropdown menu across all your calculator pages while maintaining compatibility with your existing Vercel deployment.
