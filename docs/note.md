- There shouldn't be unneccasry reload when uploading logos, also I'm often redirected to the
  homepage.
- Display logo image on the select-orginaztion top-bar when it has been uploaded.
- In the 'Schedule Campaign' section, the timezone should be the same as the Settings timezone.

- I want to make the algolia search work throughout the website.
- Optimize the design of the website.
- Add a loading screen when the website is loading, this should be a skeleton loading screen which
  has the same pattern for the page about to be displayed. Note that the Navbae should always be
  rendered and the section that loads data should be the only section that has the sekeleton loading
  not the ordinanry texts.
- Make the dashboard fully functional, from the AI search voice/text input to full answer with
  hyperlinks to questions about the app.

- We need make the Campaign types functional(remove the drop-down and change the "Select a Template" to Campaign Type) so users can select the campaign type and then create a campaign. These are 'Email Blast', 'Drip Campaign', then the Smart Campaign should have types like 'In-app Push', "Social Channels like Telegram, Discord & X".

- The 'Templates' section should show the templates that have been created by the user. It should also show with the filters of 'Edited Most Recently', 'Used Most Recently', 'Oldest First' and 'A-Z'.
- We should have a public 'Email Library' recommended by the app and a private 'Email Saved' section for custom templates by the user.
- We should add a last section which is to preview the campaign before it is sent.

- The 'Schedule your campaign', 'Templates' and all Campamign flow sections should be wired to the backend so we can either send emails immediately or schedule it, the timezone should also be the same as the Settings timezone. For other Campaign sections without API endpoints, let me know what endpoints are needed and the usage.
- The 'Schedule your campaign' section should have a preview of the campaign before it is sent.


- Map these endpoints exactly to the current frontend steps (“Schedule”, “Templates”, “Launch”) and point out which screens need which new calls for Drip + Smart.





$backend="https://onchain-backend-dvxw.onrender.com/api/v1"
$campaign="cmp4g0z890003a8302x9beztz"
$orgId="a309f5b6-fc56-4dbd-a361-80929c131db0"
$token="nwG2ibXNIqAMZAoFj0UGs3U6wl6FQPhT"
