# Rescue Route Bengaluru
Animation mode: non-animated
Preserves the previously selected non-animated operational dashboard, with the user-requested modest transitions and reduced-motion support.
Concept: a calm city evacuation situation room with a prominent geographic map.
Brand: Rescue Route. Safer Routes. Faster Rescue.
Palette: forest green #176d5b, white, sage #f4f7f5, dark slate #182f32. Red indicates hazards.
Type: Manrope headings and DM Sans body with system fallback.
Layout: permanent simulation notice; brand navigation; concise heading; scenario controls; planner beside prominent map; directions; six centre cards; transport and road operations; methodology.
Mobile: map above planner, responsive cards, stacked operations, keyboard controls.
Map: existing custom OSM raster renderer, satellite option, draggable, keyboard panning, zoom/fit, clickable markers, six layers. No Leaflet/MapLibre dependency was added because the hosted editing rules forbid additions.
Backend: street-network Dijkstra using 15483 OSM/OSRM geometry nodes, hazards and road closures applied server-side. Lexicographic flood exposure/time/distance cost. Manual/location starts fail closed outside coverage. Simulated multi-modal walking/bus transfers at shared network pickup nodes.
Data: all operations simulated; geographic route data cached from public walking/driving providers. Six fictional demo centres. Metro/hospital reference pins are approximate. Metro/boats unavailable without operational/access/navigation data.
Cover: provider generation attempted but blocked by Basic-plan requirement. Existing SVG cover rebranded; no generated imagery claimed.
Validation: Node routing regression checks; hosted TypeScript/Vite deployment gate. Local Bun and dependency toolchain unavailable. No browser verification claimed.

## Route and destination refresh
Retain Rescue Route's forest-green identity and non-animated dashboard. Refine the interface with a white/sage canvas, spacious typography, soft panel shadows, compact destination chips and a prominent forest route action. The real interactive map remains the primary visual.
Destination selection includes all 12 bundled Bengaluru areas as well as six centres. Area destinations do not inherit facility claims. Automatically frame successful routes, label the destination B, and explain same-point journeys. Main action resolves the entered origin before recalculating.
Mobile order: journey form, map, directions. Touch targets at least 44px. No unnecessary decorative motion.

## Coverage and blocked-route recovery
On-demand server-side foot/driving route lookup supplements the limited graph only when needed, with a 9-second provider timeout and existing flood/closure checks. No straight-line fallback or silent relocation. Named closure keys remain stable across network expansion.
Blocked flooding is explained through a grey dashed road preview and red impassable segments, never green recommendation or directions. Recovery controls explicitly clear simulated floods, retry lookup, or select another start. No-route map fitting centres the actual origin instead of resetting to a city-wide zoom.

Origin selection: no preset start. An explicit selected-start card and blue A marker reflect applied coordinates. Area suggestions apply immediately; address drafts hide prior routes until resolved. Search and GPS response generations are invalidated when the user changes their start.

## Device location and interactive visibility
Preserve forest-green branding while using blue #185adb exclusively for the selected journey and device-location action. Thicker white-bordered route strokes and directional chevrons stand above the muted map. Risk areas have stronger orange/red fills, hatching, depth badges and selectable area cards. High contrast is on by default; route focus reduces facility clutter. Controls provide fit journey, risk overview, full screen, GPS and guided start-pin placement with keyboard focus and reduced-motion support. Location feedback explicitly distinguishes progress, accuracy, permission denial, unavailable devices and timeout recovery.
Verification: pure geolocation and route tests passed; isolated Chromium geolocation helper tested with simulated coordinates. Full deployed-page visual verification and real-device GPS are not claimed.

## Street risk, latest user correction
The road surface is now the main risk visual: green #159447 for low simulated risk, yellow #facc15 for caution, red #dc2626 for blocked/high-risk model segments. Use thin coloured network roads and a thick white-bordered selected journey with chevrons. Default off the large flood-area fills; optional fine outlines remain. Add a persistent three-colour legend immediately above the map and clickable selected road sections for depth/name details. Preserve blue only for the device's A marker and location accuracy. Explain unavailable road lookup separately from successful device location.

## Mixed risks and light/dark preference
Respond to the user's small visual correction with scattered red high-risk pockets and yellow caution approaches together, across four map directions. All are explicit simulation data applied by the same routing model; green remains low simulated risk. Use fixed road-anchored locations so patches do not jump between requests. Keep the existing dashboard composition. Header Light / Dark buttons provide a persistent appearance choice. Dark mode uses forest surfaces #101b15 / #182b20 and pale readable text #e7f2ec, with unchanged road risk colours and darkened street tiles.

## Own transport and estimated duration
Add Own car and Two-wheeler as public transport choices and two compact selectable cards below the transport menu. The active card shows the calculated minutes; the other explicitly offers to calculate its own time. Repeat the chosen transport label beside duration in the journey summary and map card. Keep estimates distinct from live traffic and disclose motorcycle profile limitations. Retain both appearance themes and the road-risk colour system.

## Command-center visual redesign (current design authority)
This request supersedes earlier forest-green and blue decoration: near-black navy #0B1220, navy panels #111A2E, off-white text and electric cyan #22D3EE as the UI accent. Risk alone uses green, amber and red. Keep the existing dashboard composition, all controls and handlers, map geometry, routing model, search and device-location behaviour. Retain Light/Dark preference, with dark as the new default appearance.
Use Space Grotesk headings and numbers, Inter body, uppercase small section labels and tabular coordinates/depths. Use 16px spacing and 12px corners. A sticky simulated-area count banner derives its counts from the existing main hazard areas; the amber demo disclaimer remains visible. Risk cards retain their existing order/actions and receive droplet icons, large depth values, proportional bars (0–60 cm scale, clamped), coloured left borders and a soft glow for high risk.
Start demo navigation is the sole solid cyan primary button; other actions are outlined or ghost. The selected permitted route becomes thick cyan over a dark outline, while risk roads and blocked previews retain risk colours. Device position has a cyan pulse respecting both reduced-motion settings. Route information uses a frosted navy panel.
Verification: all 87 existing event handlers and all button/input/select/option counts match the pre-redesign source. Isolated desktop/mobile presentation checks with the actual styles validate palette, only-primary fill, route/road contrast, sticky banner sizes, proportional depth bars, theme switching and reduced motion. These checks are not a deployed full-app interaction test. Hosted compilation remains the deployment gate.

## Two selectable experiences
Keep the command-center Bengaluru planner and add a separate top switch to the supplied Simulation simulation. Use two clearly labelled outlined controls: Bengaluru Route Planner and Simulation. The active control uses a cyan outline. Maintain each workspace's in-session state when switching, and lazy-load the simulation on first use. Preserve the supplied Simulation design and interactions in its own frame; label its city as fictional Rivergate so its illustrative model is not confused with the Bengaluru map. On narrow screens, stack the compact brand above the two side-by-side view buttons. Keep the existing status banner and notice sticky below the switch.

## Shared appearance and Simulation branding
Use Simulation everywhere as the name of the second workspace, including its header, loading screen, alert previews, About dialog, document title, labels, logo and runtime directory. The site-wide Light/Dark setting must reach the simulation immediately without reloading it. Light mode uses the same pale backdrop and white panels as the planner with navy text, readable labels and matching notices; dark mode retains the navy scene. Keep terrain and risk geometry intact, and adapt the WebGL background/fog and software-label presentation. Provide Light/Dark controls in the shared top bar so either view can change the appearance.
