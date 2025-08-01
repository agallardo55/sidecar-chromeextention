# SidecarAI Bid Scanner Chrome Extension

An AI-powered Chrome extension for scanning and managing vehicle bids across major auction platforms.

## Features

- **Automated Vehicle Data Extraction**: Automatically extracts vehicle information from supported auction sites
- **Bid Opportunity Detection**: Identifies and tracks bid opportunities in real-time
- **Multi-Platform Support**: Works with Copart, IAAI, Manheim, and Adesa
- **Side Panel Interface**: Full-featured interface accessible from the browser sidebar
- **Popup Quick Actions**: Quick scanning and status checking via extension popup

## Supported Sites

- Copart.com
- IAAI.com
- Manheim.com
- Adesa.com

## Installation

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sidecarai-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build:extension
   ```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder

### Production Build

```bash
npm run package
```

This creates a `sidecarai-extension.zip` file that can be distributed.

## Project Structure

```
sidecarai-main/
├── public/                    # Extension-specific files
│   ├── manifest.json         # Extension manifest
│   ├── background.js         # Background service worker
│   ├── content-script.js     # Content script for webpage interaction
│   ├── popup.html           # Extension popup interface
│   ├── popup.js             # Popup logic
│   └── favicon.ico          # Extension icons
├── src/                      # React application
│   ├── components/          # React components
│   ├── pages/              # Page components
│   └── main.tsx            # Main React entry point
├── dist/                    # Built extension (generated)
└── package.json            # Project configuration
```

## Extension Architecture

### Background Script (`background.js`)
- Handles extension lifecycle events
- Manages communication between components
- Handles tab updates and content script injection
- Manages extension storage

### Content Script (`content-script.js`)
- Injected into supported auction websites
- Extracts vehicle data and bid information
- Sends data back to the extension
- Monitors page changes for dynamic content

### Popup Interface (`popup.html/popup.js`)
- Quick access interface when clicking extension icon
- Shows current page compatibility status
- Provides manual scan functionality
- Quick access to side panel

### Side Panel (`index.html` + React App)
- Full-featured interface in browser sidebar
- Vehicle scanning and management
- Bid request tracking
- User profile and settings

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:extension` - Build extension with all files
- `npm run package` - Create distributable zip file
- `npm run lint` - Run ESLint

### Adding New Auction Sites

1. Update the `supportedSites` array in `background.js`
2. Add extraction logic in `content-script.js`
3. Test with the new site

### Content Script Development

The content script automatically extracts:
- Vehicle VIN numbers
- Vehicle titles and descriptions
- Current bid amounts
- Lot numbers
- Additional bid opportunities

## Permissions

The extension requires the following permissions:

- `sidePanel` - Access to browser side panel
- `storage` - Local data storage
- `activeTab` - Access to current tab
- `scripting` - Inject content scripts
- `tabs` - Tab management
- `host_permissions` - Access to auction websites

## Security

- Content scripts run in isolated contexts
- No sensitive data is transmitted without user consent
- All data is stored locally in Chrome's extension storage
- CSP (Content Security Policy) is enforced

## Troubleshooting

### Extension Not Loading
- Ensure all files are in the `dist` directory
- Check that `manifest.json` is valid
- Verify all referenced files exist

### Content Script Not Working
- Check browser console for errors
- Verify the site is in the supported sites list
- Ensure permissions are granted

### Build Issues
- Clear the `dist` directory before rebuilding
- Check that all dependencies are installed
- Verify Vite configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license information here]

## Support

For support and questions, please [create an issue](link-to-issues) or contact the development team.
