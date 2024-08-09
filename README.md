# Drop Tables 🍀
---
## Demo Project
---
### [Presentation](https://microsoft.sharepoint.com/:p:/t/GamingDeveloperExperiencesGDX/EVoS115OuHtEjrEm5g4RiX4BXi94Uf9KHqU7L8XxETN-Xg?e=wzVfXF)
### Known Bugs / Quirks
- must 'visualize' a drop table before it can be rolled
- roll section is hard-coded and not linked to execute API currently
- poop and sword animations are hard-coded tied to the junk item and sword item
- not responsive webapp
- the roll chest table is linked to a library for exporting 3d models so I am unsure if this will work as dormant forever
- first time really using react, something like redux would have probably helped (from my brief research)
- no error messages on front end
- dont think editing certain parts of a pool is fully functional / responsive on front 

### Usage Notes
- In `src/controllers/Controller.ts`, fill in the credentials at the top (note: only certain titles have access to drop tables currently)


## Handoff
---
### Relevant Resources
- [Dev Spec](https://microsoft-my.sharepoint.com/:w:/p/t-furiebilly/ET9V1cZ_zjZFpH--EA7Mc80B9EG79BGophShZBwUc6q59w?e=2eFUjZ)
- [PM Spec](https://microsoft.sharepoint.com/:w:/t/GamingDeveloperExperiencesGDX/ERApU9mZbXVGvhvuUsVPrnIBwh9YcKCa4F2Zc9R3Q8iV5A?e=zNPS6p)
- [Demo Project](https://dev.azure.com/playfab/PlayFab/_git/BillyInterProject)


### Current State
#### Completed
- Catalog CRUD APIs for Drop Tables
- MongoDB Database Containers for Draft / Published Drop Table Details
- Catalog Evaluate Drop Table API

#### In Progress
- Main Server Error Message Builders for Drop Table APIs [PR](https://github.com/PlayFab/pf-main/pull/18898)

#### Issues
- GetEntityItems API to work for Drop Tables (Drop Table items not returning DropTableDetails in response)
- Search API to work for Drop Tables (Drop Table items not returning DropTableDetails in response)
- APIs to have end-to-end tests

#### Notes
- Maybe adding ExpandDropTableDetails (similar to ExpandItemReferences) functionality?

### Next Steps
- Add Drop Table Execution API to Inventory
- Create Game Manager / Future UX