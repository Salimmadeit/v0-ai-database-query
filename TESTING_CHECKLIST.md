# Testing Checklist

Complete testing checklist for all features and functionality.

## Pre-Testing Setup

### Environment Setup
- [ ] Dependencies installed (`pnpm install`)
- [ ] Environment variables configured in `.env.local`
- [ ] Kinde application created
- [ ] Magic link enabled in Kinde dashboard
- [ ] Callback URLs configured
- [ ] Development server running (`pnpm dev`)

### Kinde Configuration
- [ ] Client ID set
- [ ] Client secret set
- [ ] Issuer URL set
- [ ] Callback URL: `http://localhost:3000/api/auth/kinde_callback`
- [ ] Logout redirect: `http://localhost:3000`
- [ ] Magic link enabled
- [ ] Test email configured

## 1. Public Access (No Authentication)

### Home Page Access
- [ ] Open `http://localhost:3000`
- [ ] Page loads without errors
- [ ] Query input visible
- [ ] "Sign In" button visible
- [ ] No authentication required

### Query Functionality (Anonymous)
- [ ] Enter natural language query
- [ ] Click submit
- [ ] SQL generated successfully
- [ ] Query executed
- [ ] Results displayed
- [ ] Visualization options available
- [ ] Export buttons work

### Schema Explorer
- [ ] Open schema sidebar
- [ ] All tables visible
- [ ] Column details shown
- [ ] Foreign keys displayed
- [ ] No errors in console

### Query History (Anonymous)
- [ ] Query saved to history
- [ ] History visible in sidebar
- [ ] Star query works
- [ ] Delete query works
- [ ] Re-run query works

## 2. Authentication Flow

### Sign Up Flow
- [ ] Click "Sign Up" button
- [ ] Redirected to Kinde
- [ ] Enter email address
- [ ] Magic link email sent
- [ ] Email received (check spam)
- [ ] Click magic link
- [ ] Redirected to `/dashboard`
- [ ] Logged in successfully

### Sign In Flow
- [ ] Log out first
- [ ] Click "Sign In" button
- [ ] Enter email
- [ ] Magic link received
- [ ] Click link
- [ ] Logged in successfully
- [ ] Redirected to dashboard

### Session Persistence
- [ ] Refresh page
- [ ] Still logged in
- [ ] User info displayed
- [ ] Close and reopen browser
- [ ] Still logged in (if session active)

### Sign Out Flow
- [ ] Click user profile dropdown
- [ ] Click "Logout"
- [ ] Logged out successfully
- [ ] Redirected to home page
- [ ] Session cleared

## 3. Route Protection

### Dashboard Protection
- [ ] Log out completely
- [ ] Try to access `/dashboard`
- [ ] Redirected to login
- [ ] After login, redirected back to dashboard
- [ ] Dashboard accessible when logged in

### Demo Page Access
- [ ] Create a demo (see section 5)
- [ ] Copy demo URL
- [ ] Log out
- [ ] Open demo URL
- [ ] Demo loads without login
- [ ] Query and results visible

### Home Page Access
- [ ] Home page accessible logged out
- [ ] Home page accessible logged in
- [ ] All features work both ways

## 4. User ID Tracking

### Query Creation
- [ ] Log in
- [ ] Run a query
- [ ] Check query history
- [ ] Verify userId tracked in query
- [ ] Run query logged out
- [ ] Verify no userId when anonymous

### Query History
- [ ] View query history
- [ ] Check if userId displayed/tracked
- [ ] Verify user's own queries shown
- [ ] Starred queries work with userId

## 5. Demo Sharing

### Create Demo (Logged In)
- [ ] Log in
- [ ] Run a query
- [ ] Click "Share Query" button
- [ ] Dialog opens
- [ ] Click "Create Share Link"
- [ ] Demo created
- [ ] Link generated
- [ ] UserId included in demo

### Create Demo (Anonymous)
- [ ] Log out
- [ ] Run a query
- [ ] Click "Share Query"
- [ ] Create share link
- [ ] Demo created
- [ ] No userId in demo

### Copy Link
- [ ] Click copy button
- [ ] "Copied!" feedback shown
- [ ] Paste link elsewhere
- [ ] Link format correct

### Open Demo
- [ ] Click "Open" button
- [ ] Demo opens in new tab
- [ ] Query visible
- [ ] SQL visible
- [ ] Results displayed
- [ ] Creator info shown (if logged in)

### Share Link
- [ ] Copy demo link
- [ ] Open in incognito window
- [ ] Demo loads without login
- [ ] All information visible
- [ ] Can view but not edit

## 6. Dashboard Features

### Access Dashboard
- [ ] Log in
- [ ] Navigate to `/dashboard`
- [ ] Dashboard loads
- [ ] User info displayed
- [ ] Protected content visible

### Dashboard Content
- [ ] User profile shown
- [ ] User ID visible
- [ ] Email displayed
- [ ] Last login time shown
- [ ] Statistics visible

### Navigation
- [ ] Navigate to home from dashboard
- [ ] Navigate to dashboard from home
- [ ] All links work
- [ ] Back button works

## 7. Data Export

### CSV Export
- [ ] Run a query
- [ ] Click "Export CSV"
- [ ] File downloads
- [ ] Open in Excel/Sheets
- [ ] Data formatted correctly

### JSON Export
- [ ] Click "Export JSON"
- [ ] File downloads
- [ ] Valid JSON format
- [ ] Data structure correct

### Copy to Clipboard
- [ ] Click "Copy"
- [ ] Data copied
- [ ] Paste into text editor
- [ ] Format preserved

## 8. Visualizations

### Chart Types
- [ ] Run query with numeric data
- [ ] Bar chart displays
- [ ] Switch to line chart
- [ ] Switch to pie chart
- [ ] Switch to area chart
- [ ] Switch to table view
- [ ] All charts render correctly

### Chart Interactions
- [ ] Hover over chart elements
- [ ] Tooltips appear
- [ ] Data values shown
- [ ] Charts responsive
- [ ] Resize window - charts adapt

## 9. Error Handling

### Invalid Query
- [ ] Enter gibberish query
- [ ] Submit
- [ ] Error message shown
- [ ] Error is clear
- [ ] Can retry

### Network Error
- [ ] Disconnect internet
- [ ] Try to run query
- [ ] Error handled gracefully
- [ ] Reconnect
- [ ] Retry works

### Invalid SQL
- [ ] Edit SQL to invalid syntax
- [ ] Execute
- [ ] Error shown
- [ ] Can fix and retry

### Missing Demo
- [ ] Navigate to `/demo/nonexistent-id`
- [ ] "Not found" message shown
- [ ] Link to home page
- [ ] Can navigate back

## 10. Mobile Experience

### Responsive Design
- [ ] Open on mobile device
- [ ] Layout adapts
- [ ] All features accessible
- [ ] Touch interactions work
- [ ] Sidebars collapsible

### Mobile Navigation
- [ ] Menu accessible
- [ ] Auth buttons work
- [ ] Query input functional
- [ ] Results viewable
- [ ] Charts display properly

## 11. Browser Compatibility

### Chrome/Edge
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct
- [ ] Performance good

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct
- [ ] Performance good

### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct
- [ ] Performance good

## 12. Performance

### Load Times
- [ ] Home page loads quickly (<2s)
- [ ] Query execution fast (<3s)
- [ ] Demo page loads fast (<1s)
- [ ] No lag when typing

### Large Results
- [ ] Query with 1000+ rows
- [ ] Results load
- [ ] Pagination works
- [ ] Export still works
- [ ] No browser freeze

## 13. Security

### Protected Routes
- [ ] Cannot access dashboard logged out
- [ ] Demo pages always accessible
- [ ] API endpoints protected appropriately
- [ ] No sensitive data exposed

### Session Management
- [ ] Sessions expire appropriately
- [ ] Cannot reuse old magic links
- [ ] Logout clears session
- [ ] CSRF protection active

### Data Safety
- [ ] Read-only queries enforced
- [ ] No DELETE/UPDATE/DROP allowed
- [ ] Query validation works
- [ ] Injection attempts blocked

## 14. Edge Cases

### Empty Results
- [ ] Query returns no rows
- [ ] Handled gracefully
- [ ] Message shown
- [ ] No errors

### Very Long Queries
- [ ] Paste long SQL
- [ ] Interface handles it
- [ ] Can scroll/view all
- [ ] Execute works

### Special Characters
- [ ] Query with special chars
- [ ] SQL generated correctly
- [ ] Results display properly
- [ ] Export preserves chars

### Rapid Clicking
- [ ] Click submit multiple times
- [ ] No duplicate requests
- [ ] Loading state works
- [ ] Single result shown

## 15. localStorage

### Demo Storage
- [ ] Create multiple demos
- [ ] Close browser
- [ ] Reopen
- [ ] Demos still there
- [ ] Can load each demo

### Storage Limits
- [ ] Create many demos
- [ ] Check localStorage usage
- [ ] No errors at limits
- [ ] Old demos accessible

### Clear Storage
- [ ] Clear browser data
- [ ] Refresh page
- [ ] Demos gone (expected)
- [ ] App still works

## Post-Testing

### Console Check
- [ ] No errors in browser console
- [ ] No warnings (or expected only)
- [ ] Network requests successful
- [ ] No failed API calls

### Documentation Review
- [ ] All features documented
- [ ] Setup guide accurate
- [ ] Examples work
- [ ] Screenshots current

### Final Verification
- [ ] All major features work
- [ ] Authentication flow smooth
- [ ] Route protection correct
- [ ] Demo sharing functional
- [ ] No critical bugs

## Known Issues Log

Document any issues found:

| Issue | Severity | Steps to Reproduce | Status |
|-------|----------|-------------------|--------|
| | | | |

## Testing Notes

Add any observations or notes during testing:

---

## Sign-Off

- [ ] All critical tests passed
- [ ] All high priority tests passed
- [ ] Known issues documented
- [ ] Ready for deployment

**Tester:** _______________  
**Date:** _______________  
**Version:** _______________

---

## Next Steps After Testing

1. Fix any critical issues found
2. Document workarounds for known issues
3. Update documentation if needed
4. Test fixes
5. Prepare for production deployment
