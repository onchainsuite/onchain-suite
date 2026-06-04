- There shouldn't be unneccasry reload when uploading logos, also I'm often redirected to the
  homepage.
- Display logo image on the select-orginaztion top-bar when it has been uploaded.

- Optimize the design of the website.
- Make the dashboard fully functional, from the AI search voice/text input to full answer with
  hyperlinks to questions about the app.


- The 'Schedule your campaign', 'Templates' and all Campamign flow sections should be wired to the
  backend so we can either send emails immediately or schedule it, the timezone should also be the
  same as the Settings timezone. For other Campaign sections without API endpoints, let me know what
  endpoints are needed and the usage.
- The 'Schedule your campaign' section should have a preview of the campaign before it is sent.

- For Smart Sending, this campaign will not be sent to profiles who received a message from you in
  the last 10 hours. Smart Sending (thresholds) can be updated in account settings.
- For tracking, links in this campaign will include audience tracking information, called UTM
  parameters. This allows bounce tracking within third-party analytics tools such as Google
  Analytics. Learn more about UTM.

backend="https://onchain-backend-dvxw.onrender.com/api/v1" campaign="cmp4g0z890003a8302x9beztz"
orgId="a309f5b6-fc56-4dbd-a361-80929c131db0"
sessionCookie="YGPDc96O8PTD2aO3XEFPBM5Np16DWg2T.8wZ0TnsYl4gKuPMneXGND54KVZdATm%2BzFJ3fvBJFvCA%3D"

backend="https://onchain-backend-dvxw.onrender.com/api/v1"
orgId="7dd27aa6-515b-4dbf-b787-3c54e33d7528" campaign="cmp4g0z890003a8302x9beztz"
token="YGPDc96O8PTD2aO3XEFPBM5Np16DWg2T.8wZ0TnsYl4gKuPMneXGND54KVZdATm%2BzFJ3fvBJFvCA%3D"

curl -sS \
 -H "Cookie:
better-auth.session_token=${sessionCookie}" \
  -H "x-org-id: ${orgId}" \
  "${backend}/templates/cmpwcvd48000a2zen5fw9klgo"

curl -sS \
 -H "Cookie:
better-auth.session_token=${sessionCookie}" \
  -H "x-org-id: ${orgId}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Saved Template","folder":"saved","content":{"html":"<h1>Hi</h1>","textVersion":"Hi"}}' \
  "${backend}/templates"

curl -sS \
 -H "Cookie:
better-auth.session_token=${sessionCookie}" \
  -H "x-org-id: ${orgId}" \
  "${backend}/templates?folder=saved&limit=20"


