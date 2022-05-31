import {
   Project,
   Techs,
   ProjectScopes
} from '@prisma-gen/type-graphql'

export interface ProjectsFullResultType {
   id: Project['id'];
   createdAt: Project['createdAt'];
   
   title: Project['title'];
   description: Project['description']
   
   scopes: Project['scopes']
   topics?: Project['topics']
   image?: Project['image']
   
   resources?: Project['resources']
   ghRepo?: Project['ghRepo']
   website?: Project['website']
   relatedProjects?: ProjectsFullResultType[]
   relatesTo?: ProjectsFullResultType[]
   techStack?: (Techs|any)[] //TODO don't forget about adding this type TechStack[]
   
   startDate: Project['startDate']
   endDate?: Project['endDate']

   hidden: Project['hidden']
   archived: Project['archived']
}

