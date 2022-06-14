export const roleClaim = 'roles'
export const scopesClaim = 'scope'

export enum Scopes {
   objectivesHiddenRead	= "objectives:hidden:read",
   objectivesHiddenEdit	= "objectives:hidden:edit",
   projectsRelEdit = "projects-relations:edit",
   projectsRelDelete	= "projects-relations:delete",
   objectivesEedit = "objectives:edit",
   objectivesDelete = "objectives:delete",
   projectsDelete	= "projects:delete",
   projectsEdit = "projects:edit",
   projectsHiddenRead = "projects:hidden:read",
   projectsHiddenEdit = "projects:hidden:edit",
   techEdit	=  "tech:edit",
   techHiddenEdit	=  "tech:hidden:edit",
   techHiddenRead	=  "tech:hidden:read",
   techDelete	=  "tech:delete",
   schemaRead =  "schema:read",
   baseaccess = "baseaccess",
}