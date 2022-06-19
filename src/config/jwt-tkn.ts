export const roleClaim = 'roles'
export const scopesClaim = 'permissions'
export const machineScopesClaim = 'scope'

export enum Scopes {
   objectivesHiddenRead	= "cms:objectives:hidden:read",
   objectivesHiddenEdit	= "cms:objectives:hidden:edit",
   projectsRelEdit = "cms:projects-relations:edit",
   projectsRelDelete	= "cms:projects-relations:delete",
   objectivesEdit = "cms:objectives:edit",
   objectivesDelete = "cms:objectives:delete",
   projectsDelete	= "cms:projects:delete",
   projectsEdit = "cms:projects:edit",
   projectsHiddenRead = "cms:projects:hidden:read",
   projectsHiddenEdit = "cms:projects:hidden:edit",
   techEdit	=  "cms:tech:edit",
   techHiddenEdit	=  "cms:tech:hidden:edit",
   techHiddenRead	=  "cms:tech:hidden:read",
   techDelete	=  "cms:tech:delete",
   schemaRead =  "cms:schema:read",
   baseaccess = "cms:baseaccess",
   projectsCreate = "cms:projects:create",
   objectivesCreate = "cms:objectives:create",
   techCreate = "cms:tech:create",
}